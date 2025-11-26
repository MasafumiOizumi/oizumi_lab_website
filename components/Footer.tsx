export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', marginTop: 'auto', background: 'var(--color-surface)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    &copy; {new Date().getFullYear()} Oizumi Lab, The University of Tokyo.
                </p>
                <a href="/admin/index.html" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Admin Login
                </a>
            </div>
        </footer>
    );
}
