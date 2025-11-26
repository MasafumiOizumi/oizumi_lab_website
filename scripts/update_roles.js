const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rawMembersFile = path.join(__dirname, 'raw_members.txt');
const membersDir = path.join(__dirname, '../content/members');

const rawMembers = fs.readFileSync(rawMembersFile, 'utf8');
const lines = rawMembers.split('\n').filter(line => line.trim() !== '');

// Define roles
const currentRoles = ['准教授', '特任研究員', '学振CPD', 'D3', 'D2', 'D1', 'M2', 'M1', 'B4', 'B3', '特任専門職員', 'Visitor'];
const alumniRoles = ['研究員', '博士課程修了', '修士課程修了', '学部卒業'];

// Helper to find file by title
function findFileByTitle(name) {
    const files = fs.readdirSync(membersDir);
    for (const file of files) {
        const filePath = path.join(membersDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = matter(fileContent).data;
        if (data.title === name) {
            return { filename: file, data: data, content: matter(fileContent).content };
        }
    }
    return null;
}

// 1. Process Current Members First
console.log("Processing Current Members...");
lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('Alumni') || line.startsWith('Past Visitors')) return; // Skip Alumni for now

    const parts = line.split(/\s+/);
    if (parts.length < 2) return;

    const roleRaw = parts[0];
    let namePart = parts[1];
    let name = namePart;
    const linkMatch = namePart.match(/\[(.*?)\]/);
    if (linkMatch) name = linkMatch[1];

    const validRoles = ['准教授', '特任研究員', '学振CPD', 'D3', 'D2', 'D1', 'M2', 'M1', 'B4', 'B3', '特任専門職員', 'Visitors'];
    if (!validRoles.includes(roleRaw) && !roleRaw.startsWith('D') && !roleRaw.startsWith('M') && !roleRaw.startsWith('B')) return;

    let newRole = roleRaw;
    if (newRole === 'Visitors') newRole = 'Visitor';

    const found = findFileByTitle(name);
    if (found) {
        const filePath = path.join(membersDir, found.filename);
        const parsed = matter.read(filePath);
        parsed.data.role = newRole;
        fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
        console.log(`Updated Current: ${name} to role ${newRole}`);
    } else {
        console.log(`Warning: Could not find file for Current member ${name}`);
    }
});

// 2. Process Alumni Members
console.log("\nProcessing Alumni Members...");
let isAlumniSection = false;
lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('Alumni') || line.startsWith('Past Visitors')) {
        isAlumniSection = true;
    }

    if (isAlumniSection) {
        let category = '';
        let content = line;

        if (content.startsWith('研究員')) { category = '研究員'; content = content.substring(3).trim(); }
        else if (content.startsWith('博士課程終了')) { category = '博士課程修了'; content = content.substring(6).trim(); }
        else if (content.startsWith('修士課程終了')) { category = '修士課程修了'; content = content.substring(6).trim(); }
        else if (content.startsWith('学部卒業')) { category = '学部卒業'; content = content.substring(4).trim(); }
        else if (content.startsWith('Past Visitors')) { category = 'Visitor'; content = content.substring(13).trim(); }
        else { return; }

        const names = content.split(/,|、/).map(s => s.trim()).filter(s => s !== '');

        names.forEach(namePart => {
            let name = namePart.replace(/\(.*\)/, '').trim();
            const linkMatch = name.match(/\[(.*?)\]/);
            if (linkMatch) name = linkMatch[1];

            // Special case for Ben Fulcher
            if (name === 'Ben Fulcher') category = 'Visitor';

            const found = findFileByTitle(name);

            if (found) {
                // File exists. Check if we need a new file.
                const currentRole = found.data.role;

                // If the existing file has a Current Role, OR if it has a DIFFERENT Alumni role
                if (currentRoles.includes(currentRole) || (alumniRoles.includes(currentRole) && currentRole !== category)) {
                    // Create a new file for this alumni entry
                    const baseSlug = found.filename.replace('.md', '');

                    // Map category to suffix
                    let suffix = '';
                    if (category === '研究員') suffix = '-researcher';
                    else if (category === '博士課程修了') suffix = '-phd';
                    else if (category === '修士課程修了') suffix = '-master';
                    else if (category === '学部卒業') suffix = '-undergrad';
                    else if (category === 'Visitor') suffix = '-visitor';

                    const newFilename = `${baseSlug}${suffix}.md`;
                    const newFilePath = path.join(membersDir, newFilename);

                    // Clone data but update role
                    const newData = { ...found.data, role: category };
                    // Clear bio for alumni if it's not relevant (keep it if it's affiliation info for visitors)
                    if (category !== 'Visitor') newData.bio = '';

                    fs.writeFileSync(newFilePath, matter.stringify(found.content, newData));
                    console.log(`Created New Alumni File: ${newFilename} for ${name} (${category})`);
                } else {
                    // It's already this alumni role (or we can overwrite if it's safe? No, let's just leave it if it matches)
                    if (found.data.role === category) {
                        console.log(`Skipping ${name}, already has role ${category}`);
                    } else {
                        // This case should be covered by the OR above, but just in case
                        console.log(`Updating ${name} to role ${category} (Overwrite)`);
                        const filePath = path.join(membersDir, found.filename);
                        const parsed = matter.read(filePath);
                        parsed.data.role = category;
                        fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
                    }
                }
            } else {
                console.log(`Warning: Could not find base file for Alumni ${name}`);
            }
        });
    }
});
