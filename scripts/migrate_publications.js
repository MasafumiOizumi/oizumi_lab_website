const fs = require('fs');
const path = require('path');

const rawFile = path.join(__dirname, 'raw_publications.txt');
const outputDir = path.join(__dirname, '../content/publications');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const rawText = fs.readFileSync(rawFile, 'utf8');
const lines = rawText.split('\n').filter(line => line.trim() !== '');

lines.forEach(line => {
    // Regex to parse: Number. Authors (Year) [Title](Link) Journal
    // Note: This is a best-effort regex.
    const match = line.match(/^(\d+)\.\s+(.*?)\s+\((\d{4})\)\s+(?:\[(.*?)\]\((.*?)\)|(.*?))\s*(.*)$/);

    if (match) {
        const [_, number, authors, year, titleLinked, link, titlePlain, journal] = match;
        const title = titleLinked || titlePlain;
        const slug = `${year}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

        const content = `---
title: "${title.replace(/"/g, '\\"')}"
authors: "${authors}"
journal: "${journal}"
year: ${year}
doi: "${link || ''}"
---
`;

        fs.writeFileSync(path.join(outputDir, `${slug}.md`), content);
        console.log(`Generated: ${slug}.md`);
    } else {
        console.warn(`Failed to parse: ${line}`);
        // Fallback parsing for lines that might not match perfectly
        // Try simpler split
        try {
            const parts = line.split(')');
            if (parts.length > 1) {
                const firstPart = parts[0]; // Number. Authors (Year
                const yearMatch = firstPart.match(/\((\d{4})$/);
                if (yearMatch) {
                    const year = yearMatch[1];
                    const authors = firstPart.replace(/^\d+\.\s+/, '').replace(/\(\d{4}$/, '').trim();
                    const rest = parts.slice(1).join(')').trim(); // [Title](Link) Journal

                    let title = rest;
                    let link = '';
                    let journal = '';

                    const linkMatch = rest.match(/\[(.*?)\]\((.*?)\)(.*)/);
                    if (linkMatch) {
                        title = linkMatch[1];
                        link = linkMatch[2];
                        journal = linkMatch[3].trim();
                    }

                    const slug = `${year}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
                    const content = `---
title: "${title.replace(/"/g, '\\"')}"
authors: "${authors}"
journal: "${journal}"
year: ${year}
doi: "${link || ''}"
---
`;
                    fs.writeFileSync(path.join(outputDir, `${slug}.md`), content);
                    console.log(`Generated (Fallback): ${slug}.md`);
                    return;
                }
            }
        } catch (e) {
            console.error(`Error in fallback: ${e}`);
        }
        console.error(`Could not parse line: ${line}`);
    }
});
