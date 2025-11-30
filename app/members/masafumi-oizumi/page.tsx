import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getPublications } from '@/lib/api';
import Link from 'next/link';
import { Mail, ExternalLink, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface Publication {
    slug: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi?: string;
    pdf?: string;
    [key: string]: any;
}

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

async function getSectionData(filename: string) {
    const filePath = path.join(process.cwd(), `content/pi/${filename}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return data;
}

export default async function PIPage() {
    const hero = await getSectionData('hero');
    const publications = await getSectionData('publications');
    const grants = await getSectionData('grants');
    const education = await getSectionData('education');
    const workHistory = await getSectionData('work_history');
    const fellowships = await getSectionData('fellowships');
    const awards = await getSectionData('awards');

    const allPublications = getPublications() as unknown as Publication[];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-white" style={{ padding: '1.5rem 1.5rem' }}>
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-row gap-8 items-start justify-between">
                            <div className="flex-1 pt-2 text-left min-w-0" style={{ paddingLeft: '1.5rem' }}>
                                <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">{hero.title}</h1>
                                <p className="text-lg text-sky-600 mb-3 font-medium">{hero.role}</p>

                                <div className="flex items-center justify-start gap-2 text-slate-500 mb-3 text-base">
                                    <Mail size={16} className="text-sky-500" />
                                    <span className="font-medium">{hero.email}</span>
                                </div>

                                <div className="text-slate-600 whitespace-pre-line leading-relaxed max-w-none text-base">
                                    {hero.contact_info}
                                </div>
                            </div>
                            <div className="w-48 h-48 relative shrink-0 self-start">
                                <img
                                    src={hero.image}
                                    alt={hero.title}
                                    className="w-full h-full object-cover rounded-full shadow-md border-2 border-white"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Selected Publications */}
                <section className="bg-slate-50 border-y border-slate-100" style={{ padding: '1.5rem 1.5rem' }}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-base font-bold mb-6 flex items-center gap-3 text-slate-800">
                            <span className="w-1 h-4 bg-sky-500 rounded-full"></span>
                            Selected Publications
                        </h2>
                        <div className="space-y-3" style={{ paddingLeft: '1.5rem' }}>
                            {publications.selected_publications && publications.selected_publications.map((pubTitle: string, index: number) => {
                                if (typeof pubTitle !== 'string') return null;
                                const pub = allPublications.find((p: any) => typeof p.title === 'string' && p.title.toLowerCase().trim() === pubTitle.toLowerCase().trim());
                                if (!pub) return null;

                                // Format authors
                                let authors = pub.authors || '';
                                if (authors) {
                                    const authorList = authors.split(',').map((a: string) => a.trim());
                                    if (authorList.length > 5) {
                                        authors = authorList.slice(0, 5).join(', ') + ' et al.';
                                    }
                                }

                                return (
                                    <div key={index} className="flex items-start gap-2 text-base leading-relaxed">
                                        <span className="text-slate-400 mt-1 shrink-0">•</span>
                                        <div className="text-slate-700 flex-1 min-w-0">
                                            <span className="font-semibold text-slate-900">{authors}</span> ({pub.year}) "{pub.title}"{['.', '?', '!'].includes(pub.title.trim().slice(-1)) ? '' : '.'} <span className="italic text-slate-600">{pub.journal}</span>
                                            <span className="inline-flex gap-2 ml-2 align-middle">
                                                {pub.doi && (
                                                    <a href={pub.doi} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-sky-600 hover:text-sky-700 hover:underline no-underline font-semibold text-xs transition-colors">
                                                        <ExternalLink size={12} /> DOI
                                                    </a>
                                                )}
                                                {pub.pdf && (
                                                    <a href={pub.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-sky-600 hover:text-sky-700 hover:underline no-underline font-semibold text-xs transition-colors">
                                                        <FileText size={12} /> PDF
                                                    </a>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Grants */}
                <section className="bg-white" style={{ padding: '1.5rem 1.5rem' }}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-base font-bold mb-6 flex items-center gap-3 text-slate-800">
                            <span className="w-1 h-4 bg-sky-500 rounded-full"></span>
                            Grants
                        </h2>
                        <ul className="space-y-2 list-none ml-1 text-slate-600 text-base leading-relaxed" style={{ paddingLeft: '1.5rem' }}>
                            {grants.grants && grants.grants.map((grant: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-1 shrink-0">•</span>
                                    <span className="flex-1 min-w-0">{grant}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Education */}
                <section className="bg-slate-50 border-y border-slate-100" style={{ padding: '1.5rem 1.5rem' }}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-base font-bold mb-6 flex items-center gap-3 text-slate-800">
                            <span className="w-1 h-4 bg-sky-500 rounded-full"></span>
                            Education
                        </h2>
                        <div className="space-y-2 text-base text-slate-700" style={{ paddingLeft: '1.5rem' }}>
                            {education.education && education.education.map((edu: any, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-0.5 shrink-0">•</span>
                                    <span className="flex-1 min-w-0">
                                        <span className="font-bold text-sky-600">{edu.period}</span> | <span className="font-semibold text-slate-900">{edu.degree}</span>, {edu.institution}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Work History */}
                <section className="bg-white" style={{ padding: '1.5rem 1.5rem' }}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-base font-bold mb-6 flex items-center gap-3 text-slate-800">
                            <span className="w-1 h-4 bg-sky-500 rounded-full"></span>
                            Work History
                        </h2>
                        <div className="space-y-2 text-base text-slate-700" style={{ paddingLeft: '1.5rem' }}>
                            {workHistory.work_history && workHistory.work_history.map((work: any, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-0.5 shrink-0">•</span>
                                    <span className="flex-1 min-w-0">
                                        <span className="font-bold text-sky-600">{work.period}</span> | <span className="font-semibold text-slate-900">{work.role}</span>, {work.institution}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Fellowships */}
                <section className="bg-slate-50 border-y border-slate-100" style={{ padding: '1.5rem 1.5rem' }}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-base font-bold mb-6 flex items-center gap-3 text-slate-800">
                            <span className="w-1 h-4 bg-sky-500 rounded-full"></span>
                            Fellowships
                        </h2>
                        <ul className="space-y-2 list-none ml-1 text-slate-600 text-base leading-relaxed" style={{ paddingLeft: '1.5rem' }}>
                            {fellowships.fellowships && fellowships.fellowships.map((fellowship: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-1 shrink-0">•</span>
                                    <span className="flex-1 min-w-0">{fellowship}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Awards */}
                <section className="bg-white" style={{ padding: '1.5rem 1.5rem' }}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-base font-bold mb-6 flex items-center gap-3 text-slate-800">
                            <span className="w-1 h-4 bg-sky-500 rounded-full"></span>
                            Awards
                        </h2>
                        <ul className="space-y-2 list-none ml-1 text-slate-600 text-base leading-relaxed" style={{ paddingLeft: '1.5rem' }}>
                            {awards.awards && awards.awards.map((award: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-1 shrink-0">•</span>
                                    <span className="flex-1 min-w-0">{award}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
