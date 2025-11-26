import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="section" style={{ padding: '8rem 0', background: 'radial-gradient(circle at top right, var(--color-surface-alt), transparent)' }}>
            <div className="container">
                <div style={{ maxWidth: '800px' }}>
                    <h1 style={{ marginBottom: '1.5rem', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                        Unraveling the <span style={{ color: 'var(--color-accent)' }}>Consciousness</span> <br />
                        through Mathematical Theory
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
                        We are the Oizumi Laboratory at the University of Tokyo.
                        Our research tries to mathematically bridge the gap between neural activities and subjective experiences.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/publications" className="btn btn-primary">
                            View Publications
                        </Link>
                        <Link href="/members" className="btn" style={{ background: 'var(--color-surface)', border: '1px solid var(--border-color)' }}>
                            Meet the Team <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
