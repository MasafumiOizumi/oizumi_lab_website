import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { getPublications } from '../../lib/api';
import { ExternalLink, FileText } from "lucide-react";

interface Publication {
    slug: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi?: string;
    pdf?: string;
    note?: string;
    [key: string]: any;
}

interface ResearchTopic {
    title: string;
    description: string;
    weight: number;
    images?: string[];
    references?: string[]; // List of titles
}

interface ResearchPageData {
    title: string;
    overview: string;
}

function getResearchPageData(): ResearchPageData {
    const filePath = path.join(process.cwd(), 'content/pages/research.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
        title: data.title,
        overview: data.overview,
    };
}

function getResearchTopics(): ResearchTopic[] {
    const topicsDir = path.join(process.cwd(), 'content/research_topics');
    if (!fs.existsSync(topicsDir)) return [];

    const fileNames = fs.readdirSync(topicsDir);
    const topics = fileNames.map((fileName) => {
        const fullPath = path.join(topicsDir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        return {
            title: data.title,
            description: data.description || content,
            weight: data.weight || 10,
            images: data.images || [],
            references: data.references || [],
        };
    });

    return topics.sort((a, b) => a.weight - b.weight);
}

export default function Research() {
    const pageData = getResearchPageData();
    const topics = getResearchTopics();
    const allPublications = getPublications() as unknown as Publication[];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <div className="container section" style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
                    <h2 style={{ marginBottom: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{pageData.title}</h2>

                    {/* Overview */}
                    <div className="markdown-content" style={{ marginBottom: '4rem', fontSize: '1rem', lineHeight: '1.6', maxWidth: '900px' }}>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {pageData.overview}
                        </ReactMarkdown>
                    </div>

                    {/* Research Topics */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                        {topics.map((topic, index) => (
                            <section key={index} id={`topic-${index}`} style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                gap: '4rem',
                                alignItems: 'start'
                            }}>
                                {/* Left Column: Text */}
                                <div style={{ minWidth: '300px' }}>
                                    <h3 style={{
                                        fontSize: '1.8rem',
                                        fontWeight: 700,
                                        marginBottom: '1.5rem',
                                        paddingBottom: '0.5rem',
                                        borderBottom: '2px solid var(--color-primary)'
                                    }}>
                                        {topic.title}
                                    </h3>
                                    <div className="markdown-content" style={{ marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.7' }}>
                                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                            {topic.description}
                                        </ReactMarkdown>
                                    </div>

                                    {/* References */}
                                    {topic.references && topic.references.length > 0 && (
                                        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                            <h5 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-muted)' }}>Key Publications</h5>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {topic.references.map((refTitle, refIndex) => {
                                                    if (typeof refTitle !== 'string') return null;
                                                    const pub = allPublications.find((p: any) => p.title && p.title.toLowerCase().trim() === refTitle.toLowerCase().trim());
                                                    if (!pub) return null;

                                                    // Format authors
                                                    let authors = pub.authors || '';
                                                    if (authors) {
                                                        const authorList = authors.split(',').map(a => a.trim());
                                                        if (authorList.length > 5) {
                                                            authors = authorList.slice(0, 5).join(', ') + ' et al.';
                                                        }
                                                    }

                                                    return (
                                                        <div key={refIndex} style={{ fontSize: '0.85rem', lineHeight: '1.4', display: 'flex', gap: '0.5rem' }}>
                                                            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                                                            <div>
                                                                <span>{authors} ({pub.year}) "{pub.title}"{['.', '?', '!'].includes(pub.title.trim().slice(-1)) ? '' : '.'} <span style={{ fontStyle: 'italic' }}>{pub.journal}</span></span>
                                                                <div style={{ display: 'inline-flex', gap: '0.5rem', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                                                                    {pub.doi && (
                                                                        <a href={pub.doi} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.1rem', color: 'var(--color-accent)', textDecoration: 'none' }} className="hover:underline">
                                                                            <ExternalLink size={10} /> DOI
                                                                        </a>
                                                                    )}
                                                                    {pub.pdf && (
                                                                        <a href={pub.pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.1rem', color: 'var(--color-accent)', textDecoration: 'none' }} className="hover:underline">
                                                                            <FileText size={10} /> PDF
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Images */}
                                {topic.images && topic.images.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', height: '100%' }}>
                                        {topic.images.map((imgSrc, imgIndex) => (
                                            <div key={imgIndex} style={{
                                                borderRadius: 'var(--radius-md)',
                                                overflow: 'hidden',
                                                boxShadow: 'var(--shadow-md)',
                                                border: '1px solid var(--border-color)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                background: 'white'
                                            }}>
                                                <img
                                                    src={imgSrc}
                                                    alt={`${topic.title} image ${imgIndex + 1}`}
                                                    style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
