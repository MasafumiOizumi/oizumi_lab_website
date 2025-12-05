import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublications } from "@/lib/api";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

export default function Publications() {
    const publications = getPublications();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="section" style={{ flex: 1 }}>
                <div className="container">
                    <h2 style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        Publications
                    </h2>

                    <div className="publications-list">
                        {publications.map((pub: any, index: number) => (
                            <div key={pub.slug} className="publication-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-muted)', minWidth: '2.5rem', lineHeight: '1.4' }}>
                                    {publications.length - index}.
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', lineHeight: '1.4' }}>
                                        {pub.title.endsWith('.') ? pub.title.slice(0, -1) : pub.title}
                                    </h4>
                                    <p className="text-muted" style={{ marginBottom: '0.15rem', fontSize: '0.95rem' }}>{pub.authors.replace(/,?\s+and\s+([^,]+)$/, ', $1')}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                                        <span style={{ fontStyle: 'italic' }}>
                                            {/* Remove trailing dot from journal if present, then add comma */}
                                            {pub.journal.endsWith('.') ? pub.journal.slice(0, -1) : pub.journal}, {pub.year}.
                                        </span>

                                        {pub.note && (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: pub.note.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent); text-decoration: underline;">$1</a>')
                                                }}
                                            />
                                        )}

                                        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '0.25rem' }}>
                                            {pub.doi && (
                                                <a href={pub.doi} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', textDecoration: 'none' }} className="hover:underline">
                                                    <ExternalLink size={14} /> DOI
                                                </a>
                                            )}
                                            {pub.pdf && (
                                                <a href={pub.pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', textDecoration: 'none' }} className="hover:underline">
                                                    <FileText size={14} /> PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
