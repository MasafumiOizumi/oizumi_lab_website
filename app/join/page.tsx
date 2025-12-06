import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface JoinPageData {
    title: string;
    description: string;
    postdocs_title: string;
    postdocs_description: string;
    students_title: string;
    students_description: string;
}

function getJoinPageData(): JoinPageData {
    const filePath = path.join(process.cwd(), 'content/pages/join.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
        title: data.title,
        description: data.description,
        postdocs_title: data.postdocs_title,
        postdocs_description: data.postdocs_description,
        students_title: data.students_title,
        students_description: data.students_description,
    };
}

export default function Join() {
    const data = getJoinPageData();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <div className="container section" style={{ paddingBottom: '1rem', paddingTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{data.title}</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                        {data.description}
                    </p>
                </div>

                <div className="container" style={{ paddingBottom: '4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Postdocs Card */}
                        <Link href="/join/postdocs" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="glass hover:shadow-lg hover:-translate-y-1 transition-all duration-200" style={{
                                padding: '2rem',
                                borderRadius: 'var(--radius-md)',
                                height: '100%',
                                cursor: 'pointer',
                                border: '1px solid var(--border-color)'
                            }}>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{data.postdocs_title}</h4>
                                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                                    {data.postdocs_description}
                                </p>
                                <div style={{ marginTop: '1.5rem', color: 'var(--color-accent)', fontWeight: 500 }}>
                                    Read more →
                                </div>
                            </div>
                        </Link>

                        {/* Students Card */}
                        <Link href="/join/students" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="glass hover:shadow-lg hover:-translate-y-1 transition-all duration-200" style={{
                                padding: '2rem',
                                borderRadius: 'var(--radius-md)',
                                height: '100%',
                                cursor: 'pointer',
                                border: '1px solid var(--border-color)'
                            }}>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{data.students_title}</h4>
                                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                                    {data.students_description}
                                </p>
                                <div style={{ marginTop: '1.5rem', color: 'var(--color-accent)', fontWeight: 500 }}>
                                    Read more →
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
