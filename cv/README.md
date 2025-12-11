# How to Generate CV

This repository contains a script to automatically generate Masafumi Oizumi's CV from the content files.

## Prerequisites
- Node.js installed.
- Dependencies installed (`npm install`).

## How to Run
Run the following command in the project root:

```bash
node cv/generate.js
```

> **Note**: The script attempts to generate the PDF automatically. If it hangs, you can generate the PDF manually by running:
> ```bash
> npx md-to-pdf cv/CV_Masafumi_Oizumi.md
> ```

## Output
The script generates two files in the `cv/` directory:
- `CV_Masafumi_Oizumi.md`: The Markdown CV.
- `CV_Masafumi_Oizumi.pdf`: The PDF version (generated via `md-to-pdf`).

## Features
- **Data Source**: Pulls data from `content/pi` (profile, grants, etc.) and `content/publications`.
- **Filtering**: Automatically excludes preprints (arXiv, bioRxiv, PsyArXiv) unless they are marked as "in press" or "accepted".
- **Sorting**: Sorts publications by year in ascending order (Oldest -> Newest).
- **Formatting**: Generates a clean Markdown file with full author lists.

## Customization
To modify the logic (e.g., change filtering rules or sort order), edit `scripts/generate_cv.js`.
