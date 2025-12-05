import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublicationsJp } from "@/lib/api";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

export default function PublicationsJp() {
    const publications = getPublicationsJp();
    const jpPublications = publications.filter((pub: any) => pub.category === "Publication" || !pub.category);
    const interviews = publications.filter((pub: any) => pub.category === "Interview");

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="section" style={{ flex: 1 }}>
                <div className="container">
                    <h1 style={{ fontSize: '2rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        日本語出版物
                    </h1>

                    <div className="publications-list" style={{ marginBottom: '4rem' }}>
                        {jpPublications.map((pub: any, index: number) => (
                            <div key={pub.slug} className="publication-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-muted)', minWidth: '2.5rem', lineHeight: '1.4' }}>
                                    {jpPublications.length - index}.
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', lineHeight: '1.4' }}>
                                        {pub.title}
                                    </h3>
                                    <p style={{ marginBottom: '0.15rem', fontSize: '0.95rem', color: 'black' }}>{pub.authors}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                                        <span style={{ fontStyle: 'italic' }}>
                                            {pub.journal}, {pub.year}.
                                        </span>

                                        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '0.25rem' }}>
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

                    <h1 style={{ fontSize: '2rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        インタビュー
                    </h1>

                    <div className="publications-list">
                        {interviews.map((pub: any, index: number) => (
                            <div key={pub.slug} className="publication-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-muted)', minWidth: '2.5rem', lineHeight: '1.4' }}>
                                    {interviews.length - index}.
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', lineHeight: '1.4' }}>
                                        {pub.title}
                                    </h3>
                                    <p style={{ marginBottom: '0.15rem', fontSize: '0.95rem', color: 'black' }}>{pub.authors}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                                        <span style={{ fontStyle: 'italic' }}>
                                            {pub.journal}, {pub.year}.
                                        </span>

                                        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '0.25rem' }}>
                                            {pub.link && (
                                                <a href={pub.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', textDecoration: 'none' }} className="hover:underline">
                                                    <ExternalLink size={14} /> 記事URL
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
