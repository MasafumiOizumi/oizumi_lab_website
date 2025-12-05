import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getNews } from "@/lib/api";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function News() {
    const news = getNews();

    // Group by year
    const newsByYear: { [key: string]: any[] } = {};
    news.forEach((item: any) => {
        const year = new Date(item.date).getFullYear().toString();
        if (!newsByYear[year]) {
            newsByYear[year] = [];
        }
        newsByYear[year].push(item);
    });

    // Sort years descending
    const years = Object.keys(newsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="section" style={{ flex: 1 }}>
                <div className="container">
                    <h2 style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        News
                    </h2>

                    <div className="news-list">
                        {years.map((year) => (
                            <div key={year} style={{ marginBottom: '3rem' }}>
                                <h3 style={{
                                    marginBottom: '1rem',
                                    color: 'var(--color-primary)',
                                    borderBottom: '1px solid var(--color-surface-alt)',
                                    paddingBottom: '0.5rem'
                                }}>
                                    {year}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {newsByYear[year].map((item: any) => (
                                        <li key={item.slug} style={{
                                            marginBottom: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            gap: '1.5rem'
                                        }}>
                                            <span style={{
                                                fontSize: '0.95rem',
                                                color: 'var(--color-text-muted)',
                                                flexShrink: 0
                                            }}>
                                                {format(new Date(item.date), 'MM/dd')}
                                            </span>
                                            <div style={{ flex: 1, lineHeight: 1.6 }}>
                                                <ReactMarkdown
                                                    components={{
                                                        a: ({ node, ...props }) => <a {...props} style={{ color: 'var(--color-accent)', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer" />,
                                                        p: ({ node, ...props }) => <span {...props} /> // Render paragraphs as spans to avoid block margins
                                                    }}
                                                >
                                                    {item.content}
                                                </ReactMarkdown>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
