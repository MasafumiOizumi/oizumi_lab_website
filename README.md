# Oizumi Lab Website

This is the official website for the Oizumi Lab at the University of Tokyo.
Built with **Next.js**, **Tailwind CSS**, and **Decap CMS**.

## 📝 For Lab Members: How to Edit Content

You don't need to write code to update the website! We use an Admin Panel.

1.  **Go to the Admin Page:**
    [https://oizumi-lab-website.vercel.app/admin](https://oizumi-lab-website.vercel.app/admin)

2.  **Login:**
    - Click **"Login with GitHub"**.
    - *Note: You must be added as a "Collaborator" to this repository to log in.*

3.  **What you can edit:**
    - **Publications:** Add new papers (upload PDF, add DOI, etc.).
        - **Publications (JP):** For Japanese publications.
        - **Publications (EN):** For English publications.
    - **Research Page:** Update the main research topics and descriptions.
    - **Student Research:** Update the "Research Introduction" page for students.
    - **Members:** Update your profile, photo, and bio.
    - **News:** Add new announcements.
    - **Announcements:** Update the scrolling notice board on the top page.
    - **Featured Research:** Update the research highlights on the top page.
    - **Join:** Update job postings and recruitment information.
        - **Postdocs:** For postdoc recruitment.
        - **Students:** For student recruitment.

---

## 💻 For Developers: How to Run Locally

If you want to change the design or add new features, follow these steps.

### Prerequisites
- Node.js (v18 or later)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MasafumiOizumi/oizumi_lab_website.git
    cd oizumi_lab_website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in browser:**
    Visit [http://localhost:3000](http://localhost:3000).

### Project Structure

- `app/`: Main application code (Pages, Layouts).
    - `app/join/students/research/`: The new Student Research page.
- `components/`: Reusable UI components (Navbar, Footer, etc.).
- `content/`: Markdown files for the content (Database).
    - `content/publications/`: English publications.
    - `content/publications_jp/`: Japanese publications.
    - `content/student_research/`: Content for the Student Research page.
- `public/`: Static assets (Images).
- `public/admin/`: Configuration for Decap CMS (`config.yml`).
- `lib/`: Helper functions (API for fetching markdown content).

### Key Features

- **Decap CMS Integration:** Content management without coding.
- **Dual Reference System:** The Student Research page allows citing publications from both Japanese and English collections.
- **LaTeX Rendering:** Mathematical equations in markdown are rendered using `remark-math` and `rehype-katex`.
- **Responsive Design:** Optimized for various screen sizes using Tailwind CSS.

## 🚀 Deployment

The site is hosted on **Vercel**.
Any push to the `main` branch will automatically trigger a new deployment.

- **Live Site:** [https://oizumi-lab-website.vercel.app](https://oizumi-lab-website.vercel.app)
