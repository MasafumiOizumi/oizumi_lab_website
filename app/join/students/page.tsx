import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface RecruitmentData {
    title: string;
    content: string;
}

function getRecruitmentData(filename: string): RecruitmentData {
    const filePath = path.join(process.cwd(), 'content/recruitment', `${filename}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
        title: data.title,
        content: content,
    };
}

export default function Students() {
    const graduate = getRecruitmentData('graduate');

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <div className="container section" style={{ paddingBottom: '1rem', paddingTop: '2rem' }}>
                    <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{graduate.title}</h1>
                    <div style={{ marginBottom: '1rem' }}>
                        <a href="/join/faq" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--color-primary)',
                            fontWeight: 600,
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            background: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.2s'
                        }} className="hover:shadow-sm hover:border-blue-300">
                            <span style={{ fontSize: '1.2rem' }}>💡</span> 大学院進学FAQはこちら
                        </a>
                    </div>
                </div>

                {graduate.content.split(/\n(?=## )/).map((sectionContent, index) => (
                    <section
                        key={index}
                        style={{
                            padding: '3rem 0',
                            background: index % 2 === 0 ? 'var(--color-background)' : 'var(--color-surface)',
                        }}
                    >
                        <div className="container">
                            <div style={{ maxWidth: '800px' }}>
                                <div className="markdown-content postdoc-content" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            a: ({ node, ...props }) => <a {...props} style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 500 }} />,
                                            ul: ({ node, ...props }) => <ul {...props} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'disc' }} />,
                                            ol: ({ node, ...props }) => <ol {...props} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'decimal' }} />,
                                            li: ({ node, ...props }) => <li {...props} style={{ marginBottom: '0.25rem', paddingLeft: '0.5rem' }} />,
                                            p: ({ node, ...props }) => <p {...props} style={{ marginBottom: '1rem' }} />,
                                            h2: ({ node, ...props }) => <h2 {...props} style={{ marginTop: '0', marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 700 }} />,
                                            h3: ({ node, ...props }) => <h3 {...props} style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.4rem', fontWeight: 600 }} />
                                        }}
                                    >
                                        {sectionContent}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </main>
            <Footer />
        </div>
    );
}
