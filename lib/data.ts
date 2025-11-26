import fs from "fs";
import path from "path";

export function getData(directory: string) {
    const dataDirectory = path.join(process.cwd(), "data", directory);
    const filenames = fs.readdirSync(dataDirectory);

    const allData = filenames.map((filename) => {
        const filePath = path.join(dataDirectory, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(fileContents);
        return jsonData;
    });

    return allData;
}
