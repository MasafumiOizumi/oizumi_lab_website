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
                    <h1 style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        Publications
                    </h1>

                    <div className="publications-list">
                        {publications.map((pub: any, index: number) => (
                            <div key={pub.slug} className="publication-item" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-muted)', minWidth: '3rem' }}>
                                    {publications.length - index}.
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{pub.title}</h3>
                                    <p className="text-muted" style={{ marginBottom: '0.25rem' }}>{pub.authors}</p>
                                    <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
                                        {pub.journal} ({pub.year})
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {pub.doi && (
                                            <a href={pub.doi} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', fontSize: '0.9rem' }}>
                                                <ExternalLink size={14} /> DOI
                                            </a>
                                        )}
                                        {pub.pdf && (
                                            <a href={pub.pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', fontSize: '0.9rem' }}>
                                                <FileText size={14} /> PDF
                                            </a>
                                        )}
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
