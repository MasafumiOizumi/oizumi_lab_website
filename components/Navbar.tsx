"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css"; // We will create this or use global classes

const navItems = [
    { name: "Home", href: "/" },
    { name: "Publications", href: "/publications" },
    { name: "Members", href: "/members" },
    { name: "News", href: "/news" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="glass sticky-nav" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--border-color)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'var(--header-height)' }}>
                {/* Logo */}
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Oizumi Lab
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}
                            className="nav-link"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="mobile-menu-btn" style={{ display: 'none' }}>
                    <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay (Simplified for now, can be improved) */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'var(--header-height)',
                    left: 0,
                    right: 0,
                    background: 'var(--color-background)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '1rem'
                }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            style={{ display: 'block', padding: '0.5rem 0', fontWeight: 500 }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-menu { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                }
                .nav-link:hover { color: var(--color-primary) !important; }
            `}</style>
        </nav>
    );
}
