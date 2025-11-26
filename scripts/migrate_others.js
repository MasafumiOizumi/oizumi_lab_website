const fs = require('fs');
const path = require('path');

const rawMembersFile = path.join(__dirname, 'raw_members.txt');
const rawNewsFile = path.join(__dirname, 'raw_news.txt');
const outputMembersDir = path.join(__dirname, '../content/members');
const outputNewsDir = path.join(__dirname, '../content/news');

if (!fs.existsSync(outputMembersDir)) fs.mkdirSync(outputMembersDir, { recursive: true });
if (!fs.existsSync(outputNewsDir)) fs.mkdirSync(outputNewsDir, { recursive: true });

// --- Migrate Members ---
const rawMembers = fs.readFileSync(rawMembersFile, 'utf8');
const memberLines = rawMembers.split('\n').filter(line => line.trim() !== '');

let isAlumniSection = false;

memberLines.forEach(line => {
    line = line.trim();
    if (line.startsWith('Alumni') || line.startsWith('Past Visitors')) {
        isAlumniSection = true;
    }

    if (isAlumniSection) {
        // Handle Alumni lines: "Category Name, Name, Name"
        // Remove category prefix if present (e.g., "研究員 ")
        let content = line;
        const categories = ['Alumni', 'Past Visitors', '研究員', '博士課程終了', '修士課程終了', '学部卒業'];
        let category = 'Alumni';

        for (const cat of categories) {
            if (content.startsWith(cat)) {
                category = cat;
                content = content.substring(cat.length).trim();
                // Remove optional parenthesis after category
                content = content.replace(/^\(.*\)\s*/, '');
                break;
            }
        }

        if (!content) return;

        // Split by comma
        const names = content.split(/,|、/).map(s => s.trim()).filter(s => s !== '');

        names.forEach(namePart => {
            let name = namePart;
            let website = '';

            const linkMatch = namePart.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
                name = linkMatch[1];
                website = linkMatch[2];
            }

            // Clean up name
            name = name.replace(/\(.*\)/, '').trim(); // Remove university info etc if attached directly
            if (!name) return;

            let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            if (slug.length < 2) {
                slug = name.trim().replace(/\s+/g, '-');
            }

            // Avoid overwriting existing members (some alumni might be current members in different roles? unlikely but possible)
            // Actually, if they are already current members, we might skip or overwrite. 
            // Let's overwrite or create new if slug is different. 
            // But wait, "清水優梨亜" is both D2 and Alumni (Master grad). 
            // We should probably keep the Current role if it exists.
            if (fs.existsSync(path.join(outputMembersDir, `${slug}.md`))) {
                console.log(`Skipping existing member (likely current): ${name}`);
                return;
            }

            const fileContent = `---
title: "${name}"
role: "Alumni"
email: ""
website: "${website}"
bio: "${category}"
---
`;
            fs.writeFileSync(path.join(outputMembersDir, `${slug}.md`), fileContent);
            console.log(`Generated Alumni: ${slug}.md`);
        });

    } else {
        // Standard parsing for current members
        const parts = line.trim().split(/\s+/);
        if (parts.length < 2) return;

        const roleMap = {
            '准教授': 'Principal Investigator',
            '特任研究員': 'Postdoc',
            '学振CPD': 'Postdoc',
            'D3': 'PhD Student',
            'D2': 'PhD Student',
            'D1': 'PhD Student',
            'M2': 'Master Student',
            'M1': 'Master Student',
            'B4': 'Undergraduate',
            'B3': 'Undergraduate',
            '特任専門職員': 'Staff',
            '出入り許可B3': 'Undergraduate',
            'Visitors': 'Visitor'
        };

        let roleRaw = parts[0];
        let role = roleMap[roleRaw];

        if (!role) return;

        let namePart = parts[1];
        let name = namePart;
        let website = '';

        const linkMatch = namePart.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
            name = linkMatch[1];
            website = linkMatch[2];
        }

        // Email detection: look for something that looks like an email or a username
        // The format is usually: Role Name [Link] Email
        // But sometimes Email is missing.
        // If the last part contains '@' or is a known username format (alphanumeric), treat as email.
        // But "井上昌和" (name) shouldn't be treated as email.

        let email = '';
        if (parts.length > 2) {
            const lastPart = parts[parts.length - 1];
            // Check if last part is likely an email/username
            // It should be ascii.
            if (/^[a-zA-Z0-9.\-_]+$/.test(lastPart)) {
                email = lastPart;
                if (!email.includes('@')) email += '@g.ecc.u-tokyo.ac.jp';
            }
        }

        let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (slug.length < 2) {
            slug = name.trim().replace(/\s+/g, '-');
        }

        const content = `---
title: "${name}"
role: "${role}"
email: "${email}"
website: "${website}"
---
`;
        fs.writeFileSync(path.join(outputMembersDir, `${slug}.md`), content);
        console.log(`Generated Member: ${slug}.md`);
    }
});

// --- Migrate News ---
const rawNews = fs.readFileSync(rawNewsFile, 'utf8');
const newsLines = rawNews.split('\n').filter(line => line.trim() !== '');
let currentYear = '2025';

newsLines.forEach(line => {
    // Check if line is just a year
    if (/^\d{4}$/.test(line.trim())) {
        currentYear = line.trim();
        return;
    }

    // Parse date: MM/DD
    const dateMatch = line.match(/^(\d{1,2})\/(\d{1,2})\s+(.*)/);
    if (dateMatch) {
        const [_, month, day, body] = dateMatch;
        const date = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const title = body.substring(0, 50) + '...'; // Use start of body as title
        const slug = `${date}-${title.substring(0, 20).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        const content = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}T09:00:00.000Z"
---
${body}
`;
        fs.writeFileSync(path.join(outputNewsDir, `${slug}.md`), content);
        console.log(`Generated News: ${slug}.md`);
    }
});
