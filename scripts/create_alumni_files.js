const fs = require('fs');
const path = require('path');

const membersDir = path.join(__dirname, '../content/members');

const alumniData = {
    "PhD": [
        { name: "神谷俊輔", filename: "神谷俊輔-phd.md", role: "博士課程修了" },
        { name: "田口智也", filename: "田口智也-phd.md", role: "博士課程修了" }
    ],
    "Master": [
        { name: "阿部剛大", filename: "阿部剛大-master.md", role: "修士課程修了" },
        { name: "清水優梨亜", filename: "清水優梨亜-master.md", role: "修士課程修了" },
        { name: "片岡麻輝", filename: "片岡麻輝-master.md", role: "修士課程修了" },
        { name: "清岡大毅", filename: "清岡大毅-master.md", role: "修士課程修了" },
        { name: "関澤太樹", filename: "関澤太樹-master.md", role: "修士課程修了" },
        { name: "神谷俊輔", filename: "神谷俊輔-master.md", role: "修士課程修了" },
        { name: "田口智也", filename: "田口智也-master.md", role: "修士課程修了" }
    ],
    "Undergrad": [
        { name: "清岡大毅", filename: "清岡大毅-undergrad.md", role: "学部卒業" },
        { name: "阿部剛大", filename: "阿部剛大-undergrad.md", role: "学部卒業" },
        { name: "高橋創", filename: "高橋創-undergrad.md", role: "学部卒業" },
        { name: "松田青創楽", filename: "松田青創楽-undergrad.md", role: "学部卒業" }
    ]
};

// Helper to create file
function createFile(member) {
    const filePath = path.join(membersDir, member.filename);
    const content = `---
title: "${member.name}"
role: "${member.role}"
email: ""
website: ""
---
`;
    // Only create if it doesn't exist or if we want to force overwrite (let's force overwrite to be sure)
    fs.writeFileSync(filePath, content);
    console.log(`Created/Updated ${member.filename}`);
}

// Process all
Object.keys(alumniData).forEach(category => {
    alumniData[category].forEach(member => {
        createFile(member);
    });
});
