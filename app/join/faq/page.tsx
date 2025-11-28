import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface QAItem {
    question: string;
    answer: string;
}

interface Category {
    name: string;
    qa_list: QAItem[];
}

interface FAQPageData {
    title: string;
    categories: Category[];
}

function getFAQData(): FAQPageData {
    const filePath = path.join(process.cwd(), 'content/pages/faq.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
        title: data.title,
        categories: data.categories,
    };
}

export default function FAQ() {
    const data = getFAQData();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <div className="container section" style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
                    <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{data.title}</h1>

                    {/* Table of Contents */}
                    <div style={{ marginBottom: '3rem', padding: '1.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Contents</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {data.categories.map((category, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem' }}>
                                    <a href={`#category-${index}`} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }} className="hover:underline">
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* FAQ Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {data.categories.map((category, index) => (
                            <section key={index} id={`category-${index}`}>
                                <h2 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 700,
                                    marginBottom: '2rem',
                                    paddingBottom: '0.5rem',
                                    borderBottom: '2px solid var(--color-primary)'
                                }}>
                                    {category.name}
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    {category.qa_list.map((qa, qaIndex) => (
                                        <div key={qaIndex}>
                                            <h3 style={{
                                                fontSize: '1.3rem',
                                                fontWeight: 600,
                                                marginBottom: '1rem',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '0.5rem'
                                            }}>
                                                <span style={{ color: 'var(--color-accent)', minWidth: '2rem' }}>Q.</span>
                                                {qa.question}
                                            </h3>
                                            <div style={{
                                                paddingLeft: '2.5rem',
                                                color: 'var(--color-text)',
                                                lineHeight: '1.7'
                                            }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <span style={{ fontWeight: 600, minWidth: '1.5rem' }}>A.</span>
                                                    <div className="markdown-content">
                                                        <ReactMarkdown
                                                            rehypePlugins={[rehypeRaw]}
                                                            components={{
                                                                a: ({ node, ...props }) => <a {...props} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" />,
                                                                p: ({ node, ...props }) => <p {...props} style={{ marginBottom: '1rem' }} />,
                                                                ul: ({ node, ...props }) => <ul {...props} style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }} />,
                                                                li: ({ node, ...props }) => <li {...props} style={{ marginBottom: '0.5rem' }} />,
                                                            }}
                                                        >
                                                            {qa.answer}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
