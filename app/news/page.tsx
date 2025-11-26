import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getNews } from "@/lib/api";
import { format } from "date-fns";

export default function News() {
    const news = getNews();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="section" style={{ flex: 1 }}>
                <div className="container">
                    <h1 style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        News
                    </h1>

                    <div className="news-list">
                        {news.map((item: any) => (
                            <div key={item.slug} className="news-item" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-surface-alt)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                    {format(new Date(item.date), 'MMMM d, yyyy')}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                                <div style={{ lineHeight: 1.8 }}>
                                    {item.content}
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
