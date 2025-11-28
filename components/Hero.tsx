import Link from "next/link";
import { ArrowRight } from "lucide-react";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface HeroData {
    hero_title_start: string;
    hero_title_highlight: string;
    hero_title_end: string;
    hero_description: string;
    button1_text: string;
    button1_link: string;
    button2_text: string;
    button2_link: string;
}

function getHeroData(): HeroData {
    const filePath = path.join(process.cwd(), 'content/pages/home.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
        hero_title_start: data.hero_title_start,
        hero_title_highlight: data.hero_title_highlight,
        hero_title_end: data.hero_title_end,
        hero_description: data.hero_description,
        button1_text: data.button1_text,
        button1_link: data.button1_link,
        button2_text: data.button2_text,
        button2_link: data.button2_link,
    };
}

export default function Hero() {
    const data = getHeroData();

    return (
        <section className="section" style={{ padding: '8rem 0', background: 'radial-gradient(circle at top right, var(--color-surface-alt), transparent)' }}>
            <div className="container">
                <div style={{ maxWidth: '800px' }}>
                    <h1 style={{ marginBottom: '1.5rem', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                        {data.hero_title_start} <span style={{ color: 'var(--color-accent)' }}>{data.hero_title_highlight}</span> <br />
                        {data.hero_title_end}
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
                        {data.hero_description}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href={data.button1_link} className="btn btn-primary">
                            {data.button1_text}
                        </Link>
                        <Link href={data.button2_link} className="btn" style={{ background: 'var(--color-surface)', border: '1px solid var(--border-color)' }}>
                            {data.button2_text} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
