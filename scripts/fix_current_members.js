const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rawMembersFile = path.join(__dirname, 'raw_members.txt');
const membersDir = path.join(__dirname, '../content/members');

const rawMembers = fs.readFileSync(rawMembersFile, 'utf8');
const lines = rawMembers.split('\n').filter(line => line.trim() !== '');

// Define roles
const currentRoles = ['准教授', '特任研究員', '学振CPD', 'D3', 'D2', 'D1', 'M2', 'M1', 'B4', 'B3', '特任専門職員', 'Visitor'];

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

// Helper to generate slug
function generateSlug(name) {
    // Simple slug generation, can be improved
    return name.toLowerCase().replace(/\s+/g, '-');
}

console.log("Processing Current Members ONLY...");

// First, let's identify all current members from the list
const currentMemberNames = [];

lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('Alumni') || line.startsWith('Past Visitors')) return; // Skip Alumni

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

    currentMemberNames.push(name);

    // Check if file exists
    const found = findFileByTitle(name);

    if (found) {
        // Update existing file
        const filePath = path.join(membersDir, found.filename);
        const parsed = matter.read(filePath);

        // Force update role to current role
        if (parsed.data.role !== newRole) {
            console.log(`Updating ${name}: ${parsed.data.role} -> ${newRole}`);
            parsed.data.role = newRole;
            fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
        } else {
            console.log(`Verified ${name} is ${newRole}`);
        }

        // Ensure it's not marked as an alumni file (no suffix)
        // If the filename has a suffix like -master.md, we might want to rename it back if it's the ONLY file for this person?
        // But for now, let's just ensure the role is correct.

    } else {
        // Create new file if missing
        console.log(`Creating missing file for ${name} as ${newRole}`);
        // We need to try to get email/website from raw text if possible, or just create basic
        // For now, basic creation.

        // Extract email/website from line if available
        let email = '';
        let website = '';

        // Simple extraction logic from previous scripts
        // ... (simplified for this fix)

        const slug = generateSlug(name);
        const newFilePath = path.join(membersDir, `${slug}.md`);

        const content = `---
title: "${name}"
role: "${newRole}"
email: "${email}"
website: "${website}"
---
`;
        fs.writeFileSync(newFilePath, content);
    }
});

// Now, OPTIONAL: Remove any files that are NOT current members?
// The user said "forget about Alumni section".
// So maybe we should delete files that have Alumni roles?
// Or just leave them but ensure Current Members are correct.
// Let's just ensure Current Members are correct for now.

console.log("Done processing current members.");
