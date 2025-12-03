import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export function getPublications() {
    const publicationsDir = path.join(contentDirectory, "publications");

    if (!fs.existsSync(publicationsDir)) {
        return [];
    }

    const fileNames = fs.readdirSync(publicationsDir);
    const allPublications = fileNames.map((fileName) => {
        const fullPath = path.join(publicationsDir, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug: fileName.replace(/\.md$/, ""),
            ...data,
            content,
        };
    });

    // Sort by year (descending)
    return allPublications.sort((a: any, b: any) => (a.year < b.year ? 1 : -1));
}

export function getPublicationsJp() {
    const publicationsDir = path.join(contentDirectory, "publications_jp");

    if (!fs.existsSync(publicationsDir)) {
        return [];
    }

    const fileNames = fs.readdirSync(publicationsDir);
    const allPublications = fileNames.map((fileName) => {
        const fullPath = path.join(publicationsDir, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug: fileName.replace(/\.md$/, ""),
            ...data,
            content,
        };
    });

    // Sort by year (descending)
    return allPublications.sort((a: any, b: any) => (a.year < b.year ? 1 : -1));
}

export function getMembers() {
    const membersDir = path.join(contentDirectory, "members");

    if (!fs.existsSync(membersDir)) {
        return [];
    }

    const fileNames = fs.readdirSync(membersDir);
    const allMembers = fileNames.map((fileName) => {
        const fullPath = path.join(membersDir, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug: fileName.replace(/\.md$/, ""),
            ...data,
            content,
        };
    });

    // Sort order could be defined in frontmatter or by role priority
    const rolePriority: any = {
        "Principal Investigator": 1,
        "Postdoc": 2,
        "PhD Student": 3,
        "Master Student": 4,
        "Undergraduate": 5,
        "Alumni": 6
    };

    return allMembers.sort((a: any, b: any) => {
        const roleA = rolePriority[a.role] || 99;
        const roleB = rolePriority[b.role] || 99;
        return roleA - roleB;
    });
}

export function getAlumni() {
    const alumniDir = path.join(contentDirectory, "alumni");

    if (!fs.existsSync(alumniDir)) {
        return [];
    }

    const fileNames = fs.readdirSync(alumniDir);
    const allAlumni = fileNames.map((fileName) => {
        const fullPath = path.join(alumniDir, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug: fileName.replace(/\.md$/, ""),
            ...data,
            content,
        };
    });

    return allAlumni;
}

export function getNews() {
    const newsDir = path.join(contentDirectory, "news");

    if (!fs.existsSync(newsDir)) {
        return [];
    }

    const fileNames = fs.readdirSync(newsDir);
    const allNews = fileNames.map((fileName) => {
        const fullPath = path.join(newsDir, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug: fileName.replace(/\.md$/, ""),
            ...data,
            content,
        };
    });

    // Sort by date (descending)
    return allNews.sort((a: any, b: any) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

export function getNotices() {
    const noticesDir = path.join(contentDirectory, "notices");

    if (!fs.existsSync(noticesDir)) {
        return [];
    }

    const fileNames = fs.readdirSync(noticesDir);
    const allNotices = fileNames.map((fileName) => {
        const fullPath = path.join(noticesDir, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug: fileName.replace(/\.md$/, ""),
            ...data,
            content,
        };
    });

    // Sort by date (descending)
    return allNotices.sort((a: any, b: any) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}
