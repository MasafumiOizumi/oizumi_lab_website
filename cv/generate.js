const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_FILE = path.join(__dirname, 'CV_Masafumi_Oizumi.md');

// Helper to read markdown file
function readMdFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { data, content };
}

// Helper to format list items
function formatList(items, formatter) {
    if (!items) return '';
    return items.map(formatter).join('\n');
}

async function generateCV() {
    console.log('Generating CV...');

    // CSS Styling for md-to-pdf
    // User requests:
    // - Name same size as Section Titles.
    // - Section titles bigger.
    // - Normal text 11pt.
    // - "Clean, neat, professional, black fonts".
    const cssStyle = `
<style>
    body {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 11pt;
        color: #000;
        line-height: 1.4;
    }
    h1, h2 {
        font-size: 14pt; /* Make them same size and bigger than body */
        font-weight: bold;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        border-bottom: none; /* Clean look */
    }
    h1 {
        margin-top: 0;
    }
    ul, ol {
        margin-bottom: 1em;
        padding-left: 1.5em;
    }
    li {
        margin-bottom: 0.3em;
    }
    a {
        color: #000;
        text-decoration: none;
    }
    .pub-item {
        display: flex;
        margin-bottom: 0.6em; /* Spacing between papers */
    }
    .pub-number {
        min-width: 2.5em; /* Fixed width for number for alignment */
        font-weight: normal; 
        flex-shrink: 0;
    }
    .pub-content {
        
    }
</style>
`;

    let cvContent = cssStyle + '\n\n';

    // 1. Basic Information (Using Hero info mostly, but let's check PI page)
    // The user requested: "Basic information", "Education", "Work history", "Grants", "Fellowships", "Awards", and "Pulblications".
    // Basic Info from `content/pi/hero.md`
    const hero = readMdFile(path.join(CONTENT_DIR, 'pi/hero.md')).data;

    // Use H1 for Name so it matches H2 section titles in our CSS
    cvContent += `# ${hero.title}\n\n`;
    cvContent += `${hero.role}  \n`;
    // We can assume Department/Unversity are in contact_info for now or hardcode if needed, 
    // but the previous CV had them split. Let's parse contact_info which respects newlines.
    // The previous prompt's output handled this well.
    // "Department of General Systems Studies..." is in contact_info.

    // formatting contact info: replace newlines with double space + newline for markdown line break
    // BUT contact_info in yaml often preserves newlines.

    // Let's interpret contact_info.
    const contactLines = hero.contact_info ? hero.contact_info.split('\n') : [];
    const affiliationLines = contactLines.slice(0, 3); // Approx first 3 lines
    const addressLines = contactLines.slice(4, 6); // Address often follows a blank line

    // Actually, let's just dump contact_info but format it nicely.
    // The user's example output was:
    // Associate Professor
    // Department of General Systems Studies
    // ...
    // Address: ...
    // Email: ...

    // Let's reconstruct based on typical hero.md content seen previously.
    // "Department of General Systems Studies\nGraduate School of Arts and Sciences\nThe University of Tokyo\n\n3-8-1 Komaba, Meguro-ku, Tokyo 153-8902, Japan\nBuilding 16, Room 227B"

    // Affiliation
    cvContent += `Department of General Systems Studies  \n`;
    cvContent += `Graduate School of Arts and Sciences  \n`;
    cvContent += `The University of Tokyo\n\n`;

    // Address
    cvContent += `**Address:**  \n`;
    cvContent += `3-8-1 Komaba, Meguro-ku, Tokyo 153-8902, Japan  \n`;
    cvContent += `Building 16, Room 227B\n\n`;

    cvContent += `**Email:** ${hero.email.replace(' atmark ', '@')}\n\n`;

    // 2. Education
    cvContent += `## Education\n\n`;
    const education = readMdFile(path.join(CONTENT_DIR, 'pi/education.md')).data.education;
    if (education) {
        cvContent += education.map(edu => {
            return `- **${edu.degree}** (${edu.period})  \n  ${edu.institution.replace(/\n/g, ' ')}`;
        }).join('\n');
        cvContent += '\n\n';
    }

    // 3. Work History
    cvContent += `## Work History\n\n`;
    const work = readMdFile(path.join(CONTENT_DIR, 'pi/work_history.md')).data.work_history;
    if (work) {
        cvContent += work.map(w => {
            return `- **${w.role}** (${w.period})  \n  ${w.institution.replace(/\n/g, ' ')}`;
        }).join('\n');
        cvContent += '\n\n';
    }

    // 4. Grants
    cvContent += `## Grants\n\n`;
    const grants = readMdFile(path.join(CONTENT_DIR, 'pi/grants.md')).data.grants;
    if (grants) {
        cvContent += grants.map(g => `- ${g}`).join('\n');
        cvContent += '\n\n';
    }

    // 5. Fellowships
    cvContent += `## Fellowships\n\n`;
    const fellowships = readMdFile(path.join(CONTENT_DIR, 'pi/fellowships.md')).data.fellowships;
    if (fellowships) {
        cvContent += fellowships.map(f => `- ${f}`).join('\n');
        cvContent += '\n\n';
    }

    // 6. Awards
    cvContent += `## Awards\n\n`;
    const awards = readMdFile(path.join(CONTENT_DIR, 'pi/awards.md')).data.awards;
    if (awards) {
        cvContent += awards.map(a => `- ${a}`).join('\n');
        cvContent += '\n\n';
    }

    // 7. Publications
    cvContent += `## Publications\n\n`;

    // Read all publications
    const pubDir = path.join(CONTENT_DIR, 'publications');
    const pubFiles = fs.readdirSync(pubDir).filter(f => f.endsWith('.md'));

    let publications = pubFiles.map(file => {
        const { data } = readMdFile(path.join(pubDir, file));
        return data;
    });

    // Filtering: Remove preprints (arxiv, psyarxiv, biorxiv) BUT keep "In press"
    publications = publications.filter(pub => {
        const journalLower = (pub.journal || '').toLowerCase();
        const isPreprint = journalLower.includes('arxiv') || journalLower.includes('biorxiv') || journalLower.includes('psyarxiv');
        const isInPress = journalLower.includes('in press') || journalLower.includes('accepted'); // accepted implies in press usually

        // If it's a preprint, we exclude it UNLESS the user specifically said "Do not omit in press papers."
        // Usually, a paper listed as "arXiv" is NOT "in press". If it's "in press", the journal name would usually be the target journal, not arXiv.
        // However, sometimes one might write "arXiv (in press)" which is weird.
        // The rule: "Remove preprint papers which include arxiv... Do not omit in press papers."
        // Meaning: If it is purely a preprint (arXiv etc), remove. If it is "Cell Reports, in press", keep.

        if (isPreprint && !isInPress) {
            return false;
        }
        return true;
    });

    // Sorting: Newest to Oldest (Descending)
    publications.sort((a, b) => {
        if (a.year !== b.year) {
            return b.year - a.year; // Descending
        }
        return (a.title || '').localeCompare(b.title || '');
    });

    // Formatting
    const totalPubs = publications.length;

    publications.forEach((pub, index) => {
        // Numbering: Latest (Index 0) should be Largest Number (e.g. 50).
        // Oldest (Index Last) should be 1.
        const number = totalPubs - index;

        // Helper to normalize whitespace
        const normalize = (str) => (str || '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();

        let cleanTitle = normalize(pub.title);
        // Remove trailing period from title to avoid double period
        if (cleanTitle.endsWith('.')) cleanTitle = cleanTitle.slice(0, -1);

        let journal = normalize(pub.journal);
        let note = normalize(pub.note);

        // Check if journal contains embedded note like "Something... *: equal contribution"
        // Common pattern in data: "Journal Name. *: equal contribution"
        if (journal.includes('*: equal contribution')) {
            const parts = journal.split('*: equal contribution');
            journal = parts[0].trim();
            if (!note) note = '*: equal contribution'; // Move to note if not present
        }

        // Remove trailing period from journal (page.tsx logic)
        if (journal.endsWith('.')) journal = journal.slice(0, -1);

        const year = pub.year;
        const authors = normalize(pub.authors);

        // Format line
        let line = `${authors} (${year}). ${cleanTitle}. <em>${journal}</em>`;

        // Append note if exists
        if (note) {
            // Check formatting of note. If it starts with *, likely it's refering to authors.
            // Page.tsx just appends it.
            // Note often looks like "*, **: equal contribution"
            // We should append it cleanly.
            line += `. ${note}`;
        }

        // HTML Output for Flexbox (Numbers aligned 50. ... 1. )
        cvContent += `
<div class="pub-item">
    <div class="pub-number">${number}.</div>
    <div class="pub-content">${line}</div>
</div>
`;
    });

    // Write file
    fs.writeFileSync(OUTPUT_FILE, cvContent);
    console.log(`CV generated at ${OUTPUT_FILE}`);

    // Generate PDF
    console.log('Generating PDF...');
    const { exec } = require('child_process');
    exec(`npx md-to-pdf ${OUTPUT_FILE}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error generating PDF: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`PDF Gen Stderr: ${stderr}`);
        }
        console.log(`PDF generated at ${OUTPUT_FILE.replace('.md', '.pdf')}`);
    });
}
generateCV();
