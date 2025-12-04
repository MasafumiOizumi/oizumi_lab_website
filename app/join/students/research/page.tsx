import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ExternalLink, FileText } from "lucide-react";
import { getPublications, getPublicationsJp as getPublicationsJP } from '../../../../lib/api';

interface PublicationJP {
    slug: string;
    title: string;
    authors?: string;
    journal: string;
    year: number;
    pdf?: string;
    link?: string;
    category?: string;
    [key: string]: any;
}

interface StudentResearchTopic {
    title: string;
    description: string;
    weight: number;
    image?: string;
    references?: string[]; // List of titles (JP)
    references_en?: string[]; // List of titles (EN)
}

function getStudentResearchTopics(): StudentResearchTopic[] {
    const topicsDir = path.join(process.cwd(), 'content/student_research');
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
            image: data.image,
            references: data.references || [],
            references_en: data.references_en || [],
        };
    });

    return topics.sort((a, b) => a.weight - b.weight);
}



export default function StudentResearch() {
    const topics = getStudentResearchTopics();
    const jpPublications = getPublicationsJP() as unknown as PublicationJP[];
    const enPublications = getPublications() as unknown as PublicationJP[];
    const allPublications: PublicationJP[] = [...jpPublications, ...enPublications];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <div className="container section" style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
                    <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>研究内容紹介</h1>

                    {/* Research Topics */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                        {topics.map((topic, index) => (
                            <section key={index} id={`topic-${index}`} style={{ marginBottom: '6rem' }}>
                                <h2 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 700,
                                    marginBottom: '2rem',
                                    paddingBottom: '0.5rem',
                                    borderBottom: '2px solid var(--color-primary)'
                                }}>
                                    {topic.title}
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                    gap: '4rem',
                                    alignItems: 'start'
                                }}>
                                    <div style={{ minWidth: '300px' }}>
                                        <div className="markdown-content" style={{ marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.7' }}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeRaw, rehypeKatex]}
                                            >
                                                {topic.description}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {/* Right Column: Image & References */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
                                        {topic.image && (
                                            <div style={{
                                                borderRadius: 'var(--radius-md)',
                                                overflow: 'hidden',
                                                boxShadow: 'var(--shadow-md)',
                                                border: '1px solid var(--border-color)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                background: 'white'
                                            }}>
                                                <img
                                                    src={topic.image}
                                                    alt={`${topic.title} image`}
                                                    style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                                                />
                                            </div>
                                        )}

                                        {/* References */}
                                        {((topic.references && topic.references.length > 0) || (topic.references_en && topic.references_en.length > 0)) && (
                                            <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-muted)' }}>参考文献</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {[...(topic.references || []), ...(topic.references_en || [])].map((refTitle, refIndex) => {
                                                        if (typeof refTitle !== 'string') return null;
                                                        // Normalize spaces: replace newlines and multiple spaces with a single space
                                                        const normalizedRefTitle = refTitle.replace(/\s+/g, ' ').trim().toLowerCase();

                                                        const pub = allPublications.find((p) => {
                                                            if (!p.title) return false;
                                                            const normalizedPubTitle = p.title.replace(/\s+/g, ' ').trim().toLowerCase();
                                                            return normalizedPubTitle === normalizedRefTitle;
                                                        });

                                                        if (!pub) return (
                                                            <div key={refIndex} style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--color-text-muted)' }}>
                                                                • {refTitle} (Not found in database)
                                                            </div>
                                                        );

                                                        return (
                                                            <div key={refIndex} style={{ fontSize: '0.85rem', lineHeight: '1.4', display: 'flex', gap: '0.5rem' }}>
                                                                <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                                                                <div>
                                                                    <span>{pub.authors ? `${pub.authors} ` : ''}({pub.year}) "{pub.title}" <span style={{ fontStyle: 'italic' }}>{pub.journal}</span></span>
                                                                    <div style={{ display: 'inline-flex', gap: '0.5rem', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                                                                        {pub.link && (
                                                                            <a href={pub.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.1rem', color: 'var(--color-accent)', textDecoration: 'none' }} className="hover:underline">
                                                                                <ExternalLink size={10} /> Link
                                                                            </a>
                                                                        )}
                                                                        {pub.pdf && (
                                                                            <a href={pub.pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.1rem', color: 'var(--color-accent)', textDecoration: 'none' }} className="hover:underline">
                                                                                <FileText size={10} /> PDF
                                                                            </a>
                                                                        )}
                                                                        {/* Handle DOI if present (English publications often have DOI but not link/pdf fields in the same way) */}
                                                                        {pub.doi && (
                                                                            <a href={pub.doi} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.1rem', color: 'var(--color-accent)', textDecoration: 'none' }} className="hover:underline">
                                                                                <ExternalLink size={10} /> DOI
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
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main >
            <Footer />
        </div >
    );
}
