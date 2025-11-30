import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";

interface ResearchItem {
    id: string;
    title: string;
    date: string;
    description: string;
    link: string;
    press_release_link?: string;
    image?: string;
}

export default function FeaturedResearch({ research }: { research: ResearchItem[] }) {
    if (!research || research.length === 0) return null;

    return (
        <section className="section" style={{ padding: '4rem 0', background: 'var(--color-surface-alt)' }}>
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    <FlaskConical size={28} />
                    <h2>Featured Research</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {research.map((item) => (
                        <div key={item.id} style={{
                            background: 'var(--color-surface)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Image Placeholder Area */}
                            <div style={{
                                height: '300px',
                                background: 'var(--color-surface-alt)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid var(--border-color)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {item.image ? (
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <span style={{ color: 'var(--color-text-muted)' }}>Research Image</span>
                                )}
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                                    {item.title}
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>
                                    {item.description}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                                    <Link href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        padding: '0.5rem 1rem'
                                    }}>
                                        Read Paper <ArrowRight size={16} />
                                    </Link>

                                    {item.press_release_link && (
                                        <Link href={item.press_release_link} target="_blank" rel="noopener noreferrer" className="btn" style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'var(--color-surface-alt)',
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--color-text-main)',
                                            fontSize: '0.9rem',
                                            padding: '0.5rem 1rem'
                                        }}>
                                            Know More
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
