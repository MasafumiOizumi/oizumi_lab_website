const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const publicationsDir = path.join(process.cwd(), 'content/publications');
const files = fs.readdirSync(publicationsDir);

const publications = files.map(file => {
    const content = fs.readFileSync(path.join(publicationsDir, file), 'utf8');
    const { data } = matter(content);
    return {
        file,
        title: data.title,
        year: data.year
    };
});

// Sort by year desc, then title asc
publications.sort((a, b) => {
    if (a.year !== b.year) {
        return b.year - a.year;
    }
    return a.title.localeCompare(b.title);
});

console.log("Index | Year | Title");
publications.forEach((pub, index) => {
    console.log(`[${index + 1}] ${pub.year} - ${pub.title}`);
});
