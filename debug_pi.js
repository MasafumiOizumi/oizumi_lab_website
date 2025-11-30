const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const filePath = path.join(process.cwd(), 'content/pages/pi.md');
console.log(`Reading file from: ${filePath}`);

try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('File content read successfully.');
    console.log('--- Raw Content Start ---');
    console.log(fileContent.slice(0, 200) + '...');
    console.log('--- Raw Content End ---');

    const { data } = matter(fileContent);
    console.log('Parsed Data Keys:', Object.keys(data));

    console.log('Title:', data.title);
    console.log('Selected Publications Count:', data.selected_publications ? data.selected_publications.length : 'undefined');
    console.log('Grants Count:', data.grants ? data.grants.length : 'undefined');
    console.log('Education Count:', data.education ? data.education.length : 'undefined');
    console.log('Work History Count:', data.work_history ? data.work_history.length : 'undefined');
    console.log('Fellowships Count:', data.fellowships ? data.fellowships.length : 'undefined');
    console.log('Awards Count:', data.awards ? data.awards.length : 'undefined');

} catch (error) {
    console.error('Error reading or parsing file:', error);
}
