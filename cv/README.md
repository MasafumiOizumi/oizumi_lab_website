# Update the English CV

The website content is the source of truth. Update the website first, then regenerate the CV; do not maintain a second biography or publication list in the generated CV files.

## Routine

1. Update the profile through the website CMS or `content/pi/*.md`, and update papers in `content/publications/*.md`.
2. From the repository root, run:

   ```bash
   npm run cv
   ```

3. Open `cv/CV_Masafumi_Oizumi.docx` or `.pdf` and inspect every page. The command also prints a temporary directory containing page images for checking layout.
4. Review the profile changes and publication status, then commit and push the website changes. Vercel deploys pushes to `main`.
5. To update the Google Docs CV, ask Codex: "Regenerate my English CV from this repository, update my existing Google Doc in place, and verify the exported PDF." Use the [existing CV](https://docs.google.com/document/d/15UujT0KkB3w_mZJhroka2LfL-sGu2zQ8RV8hO8jnGRE/edit). Codex should read its current structure, apply the requested changes while matching its formatting, then read back the native document and verify its PDF export. A local generation command does not write to Google Drive. A complete rewrite needs explicit authorization to replace all of its contents; a new copy can instead be imported from the checked Word file when requested.

## Sources and formatting

- `content/pi/hero.md`: name, role, affiliation, office address and email. The CV links to the current lab website.
- `content/pi/education.md`, `work_history.md`, `grants.md`, `fellowships.md`, `awards.md`: complete profile sections. Only appointments on the current website are included.
- `content/pi/publications.md`: the same Selected Publications as the profile page, ordered newest first. This section appears before the complete publication list in the CV and does not replace entries in that list.
- `content/publications/*.md`: all entries in the English publication list, including conference/workshop papers and book chapters. The Japanese publication/interview list is outside this English CV's scope.
- The reference CV's section sequence and typography are retained: Arial 11 pt body, 26 pt name, 20 pt section headings and 16 pt publication group headings. Education is oldest first; work history follows the website; publications are newest first within each group, with titles breaking year ties.
- Published and in-press papers precede preprints. Each group has its own descending numbering. Full author lists, contribution notes and clickable source links are included.

## Publication status

Classification uses the venue in the `journal` field, not the URL. A published paper may still link to arXiv.

- `reviewed preprint`, including an eLife reviewed preprint, belongs to **Preprints**.
- `in press` or `accepted` belongs to **Published or in Press**, even when the paper links to a preprint.
- arXiv, bioRxiv, PsyArXiv, medRxiv or another explicitly labeled preprint belongs to **Preprints**.
- Other journals, published proceedings, workshop papers and book chapters belong to **Published or in Press**.
- When a paper is published, replace its preprint venue/year/link with the final citation in the existing file; do not create a second record. It moves groups on the next regeneration.
- An optional frontmatter field `status: published`, `status: in_press` or `status: preprint` overrides automatic classification. Use it only when the venue label alone is insufficient.

## Dependencies and outputs

Install the repository's Node dependencies with `npm install`. Word/PDF creation uses the bundled Codex Documents Python runtime and headless LibreOffice, resolved locally without downloading a PDF generator. On another setup, `CV_PYTHON` can point to a Python executable with `python-docx`, `pdf2image` and Pillow, and `CV_DOCUMENTS_SKILL` can point to the Documents skill folder containing `render_docx.py` and `scripts/google_docs_title_sanitize.py`. That renderer also requires LibreOffice and Poppler.

The command writes Markdown, Word and PDF versions under `cv/`. If rendering fails, it exits with an error; do not treat an older PDF as the current output. For a content-only regeneration without the document runtime, use `npm run cv -- --markdown-only`. For a structured paragraph model used by the Google Docs update procedure, use `node cv/generate.js --json`.
