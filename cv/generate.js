const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const matter = require('gray-matter');

const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');
const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
const read = file => matter(fs.readFileSync(file, 'utf8')).data;
const section = name => read(path.join(CONTENT, 'pi', `${name}.md`));
const withoutPeriod = value => normalize(value).replace(/\.$/, '');

function publicationStatus(pub) {
    if (pub.status !== undefined) {
        if (!['published', 'in_press', 'preprint'].includes(pub.status)) {
            throw new Error(`Invalid publication status for ${pub.title}: ${pub.status}`);
        }
        return pub.status;
    }
    const venue = normalize(pub.journal).toLowerCase();
    if (/reviewed\s+preprint/.test(venue)) return 'preprint';
    if (/\bin[ -]press\b|\baccepted\b/.test(venue)) return 'in_press';
    if (/\b(?:arxiv|biorxiv|psyarxiv|medrxiv|preprints?)\b/.test(venue)) return 'preprint';
    return 'published';
}

function buildCV() {
    const hero = section('hero');
    const publications = fs.readdirSync(path.join(CONTENT, 'publications'))
        .filter(file => file.endsWith('.md'))
        .map(file => ({ ...read(path.join(CONTENT, 'publications', file)), source: file }));
    const titles = new Set();
    for (const pub of publications) {
        for (const field of ['title', 'authors', 'journal']) {
            if (!normalize(pub[field])) throw new Error(`Missing ${field}: ${pub.source}`);
        }
        if (!Number.isInteger(pub.year)) throw new Error(`Invalid year: ${pub.source}`);
        const key = withoutPeriod(pub.title).toLowerCase();
        if (titles.has(key)) throw new Error(`Duplicate publication: ${pub.title}`);
        titles.add(key);
        pub.status = publicationStatus(pub);
        pub.title = withoutPeriod(pub.title);
        pub.authors = normalize(pub.authors);
        const noteParts = normalize(pub.journal).split(/\s+(?=\*:\s*equal contribution)/i);
        pub.journal = withoutPeriod(noteParts[0]);
        pub.note = normalize(pub.note || noteParts[1]);
        pub.link = pub.doi || pub.pdf || pub.link || '';
        if (pub.link) new URL(pub.link);
    }
    publications.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'en'));
    const selectedTitles = section('publications').selected_publications || [];
    const selectedKeys = new Set(selectedTitles.map(title => withoutPeriod(title).toLowerCase()));
    for (const title of selectedTitles) {
        if (!titles.has(withoutPeriod(title).toLowerCase())) {
            throw new Error(`Selected publication not found: ${title}`);
        }
    }
    const selected = publications.filter(pub => selectedKeys.has(pub.title.toLowerCase()));
    const published = publications.filter(pub => pub.status !== 'preprint');
    const preprints = publications.filter(pub => pub.status === 'preprint');
    const paragraphs = [];
    const add = (kind, text, extra = {}) => {
        const source = normalize(text);
        const pattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
        const links = [];
        let plain = '', cursor = 0, match;
        while ((match = pattern.exec(source))) {
            plain += source.slice(cursor, match.index);
            links.push({ start: plain.length, text: match[1], url: match[2] });
            plain += match[1];
            cursor = pattern.lastIndex;
        }
        plain += source.slice(cursor);
        if (extra.link && extra.linkText) {
            plain = plain.replace(/ DOI$/, '\u00a0DOI');
            links.push({ start: plain.lastIndexOf(extra.linkText), text: extra.linkText, url: extra.link });
        }
        paragraphs.push({ kind, text: plain, links });
    };
    const addPublications = group => group.forEach((pub, index) => {
        add('pub_start', `${group.length - index}. ${pub.authors} (${pub.year})`);
        add('pub_title', `${pub.title}${/[?!]$/.test(pub.title) ? '' : '.'}`);
        let venue = `${pub.journal}.`;
        if (pub.note) venue += ` ${pub.note}`;
        if (pub.link) venue += ' DOI';
        add('pub_end', venue, { link: pub.link, linkText: pub.link ? 'DOI' : '' });
    });

    add('title', `${hero.title}, Ph.D.`);
    add('contact', hero.role);
    for (const line of String(hero.contact_info || '').split('\n').filter(line => line.trim())) {
        add('contact', line);
    }
    const email = normalize(hero.email).replace(/\s+atmark\s+/i, '@');
    add('contact', `E-mail: ${email}`, { link: `mailto:${email}`, linkText: email });
    add('contact', 'URL: https://oizumi-lab-website.vercel.app', {
        link: 'https://oizumi-lab-website.vercel.app', linkText: 'https://oizumi-lab-website.vercel.app'
    });

    add('heading', 'EDUCATION');
    const education = [...section('education').education].sort((a, b) => a.period.localeCompare(b.period));
    for (const edu of education) add('entry', `${edu.period} ${edu.degree} ${edu.institution}`);
    add('heading', 'WORK HISTORY');
    for (const work of section('work_history').work_history) {
        add('entry_start', `${work.period}, ${work.role}`);
        add('entry_end', work.institution);
    }
    add('heading', 'Grants and Fellowships');
    for (const grant of section('grants').grants) add('entry', grant);
    for (const fellowship of section('fellowships').fellowships) add('entry', fellowship);
    add('heading', 'Awards');
    for (const award of section('awards').awards) add('entry', award);
    if (selected.length) {
        add('heading', 'Selected Publications');
        addPublications(selected);
    }
    add('heading', 'PUBLICATIONS');
    for (const [label, group] of [['Published or in Press', published], ['Preprints', preprints]]) {
        add('subheading', label);
        addPublications(group);
    }
    return { paragraphs, selected, published, preprints, counts: { selected: selected.length, published: published.length, preprints: preprints.length } };
}

function markdown(data) {
    const escape = text => text.replace(/([*_<>])/g, '\\$1');
    return data.paragraphs.map(p => {
        if (p.kind === 'title') return `# ${p.text}\n\n`;
        if (p.kind === 'heading') return `## ${p.text}\n\n`;
        if (p.kind === 'subheading') return `### ${p.text}\n\n`;
        let text = '', cursor = 0;
        for (const link of p.links) {
            text += escape(p.text.slice(cursor, link.start)) + `[${escape(link.text)}](${link.url})`;
            cursor = link.start + link.text.length;
        }
        text += escape(p.text.slice(cursor));
        if (['entry', 'entry_end', 'pub_end'].includes(p.kind)) return `${text}\n\n`;
        return `${text}<br>\n`;
    }).join('').trimEnd() + '\n';
}

function run(executable, args, options = {}) {
    const result = spawnSync(executable, args, { encoding: 'utf8', timeout: 300000, ...options });
    if (result.error || result.status !== 0) {
        throw new Error(result.error?.message || `${executable} failed:\n${result.stderr || result.stdout}`);
    }
    if (result.stdout) process.stdout.write(result.stdout);
    return result;
}

function generate() {
    const data = buildCV();
    if (process.argv.includes('--json')) {
        process.stdout.write(JSON.stringify(data));
        return;
    }
    const base = path.join(__dirname, 'CV_Masafumi_Oizumi');
    fs.writeFileSync(`${base}.md`, markdown(data));
    console.log(`CV: ${data.counts.selected} selected; ${data.counts.published} published/in press; ${data.counts.preprints} preprints.`);
    if (process.argv.includes('--markdown-only')) return;
    const dependencies = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies');
    const python = process.env.CV_PYTHON || path.join(dependencies, 'python/bin/python3');
    const documentsRoot = path.join(os.homedir(), '.codex/plugins/cache/openai-primary-runtime/documents');
    const versions = fs.existsSync(documentsRoot) ? fs.readdirSync(documentsRoot).sort((a, b) => b.localeCompare(a, undefined, { numeric: true })) : [];
    const skill = process.env.CV_DOCUMENTS_SKILL || versions
        .map(version => path.join(documentsRoot, version, 'skills/documents'))
        .find(dir => fs.existsSync(path.join(dir, 'render_docx.py')));
    if (!fs.existsSync(python) || !skill) {
        throw new Error('Markdown was generated. Word/PDF generation needs the Codex Documents runtime; see cv/README.md.');
    }
    const qa = fs.mkdtempSync(path.join(os.tmpdir(), 'oizumi-cv-render-'));
    const modelFile = path.join(qa, 'source.json');
    fs.writeFileSync(modelFile, JSON.stringify(data));
    run(python, [path.join(__dirname, 'generate_docx.py'), `${base}.docx`, modelFile]);
    const sanitized = `${base}.sanitized.docx`;
    run(python, [path.join(skill, 'scripts/google_docs_title_sanitize.py'), `${base}.docx`, '--out', sanitized]);
    fs.renameSync(sanitized, `${base}.docx`);
    run(python, [path.join(skill, 'scripts/google_docs_title_sanitize.py'), `${base}.docx`, '--check']);
    run(python, [path.join(skill, 'render_docx.py'), `${base}.docx`, '--output_dir', qa, '--emit_pdf']);
    fs.copyFileSync(path.join(qa, 'CV_Masafumi_Oizumi.pdf'), `${base}.pdf`);
    console.log(`Saved Word, PDF and Markdown in ${__dirname}.\nInspect all rendered pages before sharing: ${qa}`);
}

if (require.main === module) {
    try { generate(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { buildCV, publicationStatus, markdown };
