const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const yaml = require('js-yaml');

const sourceFile = path.join(__dirname, '../content/pages/pi.md');
const targetDir = path.join(__dirname, '../content/pi');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const fileContent = fs.readFileSync(sourceFile, 'utf8');
const { data } = matter(fileContent);

// Helper to write file
function writeSection(filename, content) {
    const filePath = path.join(targetDir, filename);
    const fileContent = `---\n${yaml.dump(content)}---\n`;
    fs.writeFileSync(filePath, fileContent);
    console.log(`Created ${filename}`);
}

// 1. Hero
writeSection('hero.md', {
    title: data.title,
    role: data.role,
    image: data.image,
    email: data.email,
    contact_info: data.contact_info
});

// 2. Publications
writeSection('publications.md', {
    selected_publications: data.selected_publications
});

// 3. Grants
writeSection('grants.md', {
    grants: data.grants
});

// 4. Education
writeSection('education.md', {
    education: data.education
});

// 5. Work History
writeSection('work_history.md', {
    work_history: data.work_history
});

// 6. Fellowships
writeSection('fellowships.md', {
    fellowships: data.fellowships
});

// 7. Awards
writeSection('awards.md', {
    awards: data.awards
});

console.log('Migration complete!');
