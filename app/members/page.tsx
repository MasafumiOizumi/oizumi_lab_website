import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMembers, getAlumni } from "@/lib/api";
import { Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Members() {
    const members = getMembers();
    const alumni = getAlumni();

    // Group members by role
    const groups = {
        "Staff": [], // Merged PI, Postdoc, Staff
        "PhD Student": [],
        "Master Student": [],
        "Undergraduate": [],
        "Visitor": [],
        "Alumni": {
            "Researcher": [],
            "PhD": [],
            "Master": [],
            "Undergrad": []
        }
    };

    members.forEach((member: any) => {
        const group = member.group;

        if (['Principal Investigator', 'Postdoc', 'Staff'].includes(group)) {
            // @ts-ignore
            groups["Staff"].push(member);
        } else if (group === 'PhD Student') {
            // @ts-ignore
            groups["PhD Student"].push(member);
        } else if (group === 'Master Student') {
            // @ts-ignore
            groups["Master Student"].push(member);
        } else if (group === 'Undergraduate') {
            // @ts-ignore
            groups["Undergraduate"].push(member);
        } else if (group === 'Visitor') {
            // @ts-ignore
            groups["Visitor"].push(member);
        }
    });

    // Process Alumni
    alumni.forEach((alum: any) => {
        const roles = alum.roles || [];

        if (roles.includes('研究員')) {
            // @ts-ignore
            groups["Alumni"]["Researcher"].push(alum);
        }
        if (roles.includes('博士課程修了')) {
            // @ts-ignore
            groups["Alumni"]["PhD"].push(alum);
        }
        if (roles.includes('修士課程修了')) {
            // @ts-ignore
            groups["Alumni"]["Master"].push(alum);
        }
        if (roles.includes('学部卒業')) {
            // @ts-ignore
            groups["Alumni"]["Undergrad"].push(alum);
        }
        // Fallback if no roles match but is in alumni folder?
        if (roles.length === 0) {
            // @ts-ignore
            groups["Alumni"]["Researcher"].push(alum);
        }
    });

    // Custom sort for the merged "Staff" group
    // Order: Oizumi (PI) -> Postdocs -> Yokota (Staff)
    // @ts-ignore
    groups["Staff"].sort((a: any, b: any) => {
        // 1. Oizumi first
        if (a.title.includes("大泉")) return -1;
        if (b.title.includes("大泉")) return 1;

        // 3. Yokota last
        if (a.title.includes("横田")) return 1;
        if (b.title.includes("横田")) return -1;

        // 2. Postdocs (and anyone else) in middle
        // If both are Postdocs, maybe sort alphabetical or keep order?
        // Let's just sort by group priority if needed, but here they are likely all Postdocs
        return 0;
    });

    const sections = [
        { title: "Staff", key: "Staff" },
        { title: "PhD Students", key: "PhD Student" },
        { title: "Master Students", key: "Master Student" },
        { title: "Undergraduate Students", key: "Undergraduate" },
        { title: "Visitors", key: "Visitor" },
        { title: "Alumni", key: "Alumni" },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="section" style={{ flex: 1 }}>
                <div className="container">
                    <h2 style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        Members
                    </h2>

                    {sections.map((section) => {
                        if (section.key === "Alumni") {
                            // Special handling for Alumni sub-sections
                            const alumniGroups = [
                                { title: "Research Staff", key: "Researcher" },
                                { title: "Ph.D. Graduates", key: "PhD" },
                                { title: "Master's Graduates", key: "Master" },
                                { title: "Bachelor's Graduates", key: "Undergrad" },
                            ];

                            // Define sorting order for each category
                            // Define sorting order for each category
                            const sortOrders = {
                                "Researcher": ["佐々木大", "鹿内友美", "北園淳", "川北源二", "藤井敬子"],
                                "PhD": ["田口智也", "神谷俊輔"],
                                "Master": ["阿部剛大", "清水優梨亜", "片岡麻輝", "清岡大毅", "関澤太樹", "田口智也", "神谷俊輔"],
                                "Undergrad": ["高橋創", "松田青創楽", "阿部剛大", "清岡大毅"]
                            };

                            const englishNames: { [key: string]: string } = {
                                "佐々木大": "Masaru Sasaki",
                                "鹿内友美": "Yumi Shikauchi",
                                "北園淳": "Jun Kitazono",
                                "川北源二": "Genji Kawakita",
                                "藤井敬子": "Keiko Fujii",
                                "田口智也": "Tomoya Taguchi",
                                "神谷俊輔": "Shunsuke Kamiya",
                                "阿部剛大": "Kota Abe",
                                "清水優梨亜": "Yuria Shimizu",
                                "片岡麻輝": "Asaki Kataoka",
                                "清岡大毅": "Daiki Kiyooka",
                                "関澤太樹": "Daiki Sekizawa",
                                "高橋創": "Soh Takahashi",
                                "松田青創楽": "Aozora Matsuda"
                            };

                            const noLinkMembers = ["鹿内友美", "北園淳", "川北源二"];

                            // Check if there are any alumni
                            // @ts-ignore
                            const hasAlumni = Object.values(groups["Alumni"]).some((arr: any) => arr.length > 0);
                            if (!hasAlumni) return null;

                            return (
                                <div key="Alumni" style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                                        Alumni
                                    </h3>
                                    {alumniGroups.map((sub) => {
                                        // @ts-ignore
                                        let subMembers = groups["Alumni"][sub.key];
                                        if (subMembers.length === 0) return null;

                                        // Sort members if order is defined
                                        // @ts-ignore
                                        if (sortOrders[sub.key]) {
                                            subMembers.sort((a: any, b: any) => {
                                                // @ts-ignore
                                                const indexA = sortOrders[sub.key].indexOf(a.title);
                                                // @ts-ignore
                                                const indexB = sortOrders[sub.key].indexOf(b.title);

                                                // If both are in the list, sort by index
                                                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                                // If only A is in list, A comes first
                                                if (indexA !== -1) return -1;
                                                // If only B is in list, B comes first
                                                if (indexB !== -1) return 1;
                                                // Otherwise keep original order (or alphabetical?)
                                                return 0;
                                            });
                                        }

                                        return (
                                            <div key={sub.key} style={{ marginBottom: '1rem' }}>
                                                <h4 style={{ fontSize: '1.4rem', marginBottom: '0.25rem', color: 'var(--color-text-muted)' }}>{sub.title}</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 2rem' }}>
                                                    {subMembers.map((member: any) => (
                                                        <div key={member.slug} style={{ fontSize: '1.1rem' }}>
                                                            {(() => {
                                                                const hasEnglishName = englishNames[member.title];
                                                                const displayName = (
                                                                    <>
                                                                        {member.title}
                                                                        {hasEnglishName && (
                                                                            <span style={{ fontSize: '0.85em', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                                                                                ({hasEnglishName})
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                );
                                                                const shouldLink = member.website && !noLinkMembers.some(name => member.title.includes(name));

                                                                return shouldLink ? (
                                                                    <a href={member.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} className="hover:border-primary">
                                                                        {displayName}
                                                                    </a>
                                                                ) : (
                                                                    <span>{displayName}</span>
                                                                );
                                                            })()}
                                                            {member.bio && (
                                                                <span style={{ marginLeft: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                                                                    {member.bio}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }

                        // @ts-ignore
                        const sectionMembers = groups[section.key];
                        if (sectionMembers.length === 0) return null;

                        const isSimpleList = section.key === "Visitor";

                        // Sort visitors by date (newest first)
                        if (section.key === "Visitor") {
                            sectionMembers.sort((a: any, b: any) => {
                                const dateA = a.date ? new Date(a.date).getTime() : 0;
                                const dateB = b.date ? new Date(b.date).getTime() : 0;
                                return dateB - dateA;
                            });
                        }

                        // Sort students by grade then by last name
                        if (["PhD Student", "Master Student", "Undergraduate"].includes(section.key)) {
                            const gradeOrder: { [key: string]: number } = {
                                "D3": 1, "D2": 2, "D1": 3,
                                "M2": 4, "M1": 5,
                                "B4": 6, "B3": 7, "B2": 8, "B1": 9
                            };
                            sectionMembers.sort((a: any, b: any) => {
                                const gradeA = gradeOrder[a.role] || 99;
                                const gradeB = gradeOrder[b.role] || 99;

                                if (gradeA !== gradeB) {
                                    return gradeA - gradeB;
                                }

                                // If grades are same, sort by last name
                                const nameA = a.name_en || a.title;
                                const nameB = b.name_en || b.title;

                                const lastNameA = nameA.trim().split(' ').pop().toLowerCase();
                                const lastNameB = nameB.trim().split(' ').pop().toLowerCase();

                                return lastNameA.localeCompare(lastNameB);
                            });
                        }

                        return (
                            <div key={section.key} style={{ marginBottom: '4rem' }}>
                                <h3 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>
                                    {section.title}
                                </h3>

                                {isSimpleList ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem' }}>
                                        {sectionMembers.map((member: any) => (
                                            <div key={member.slug} style={{ fontSize: '1.1rem' }}>
                                                {member.website ? (
                                                    <a href={member.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} className="hover:border-primary">
                                                        {member.title}
                                                    </a>
                                                ) : (
                                                    <span>{member.title}</span>
                                                )}
                                                {member.bio && (
                                                    <span style={{ marginLeft: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                                                        {member.bio}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                        gap: '2rem'
                                    }}>
                                        {sectionMembers.map((member: any) => (
                                            <div key={member.slug} className="glass" style={{
                                                padding: '1.5rem',
                                                borderRadius: 'var(--radius-md)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--color-surface-alt)',
                                                    marginBottom: '1rem',
                                                    overflow: 'hidden'
                                                }}>
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                                                    {member.title}
                                                </h4>
                                                {member.name_en && (
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', marginTop: '-0.25rem' }}>
                                                        {member.name_en}
                                                    </p>
                                                )}
                                                <p style={{ color: 'var(--color-accent)', fontWeight: 500, marginBottom: '0.5rem' }}>{member.role}</p>

                                                {member.bio && (
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                                        {member.bio}
                                                    </div>
                                                )}

                                                {member.email && (
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                                        Email: {member.email.split('@')[0]}
                                                    </p>
                                                )}

                                                {(member.title === "Masafumi Oizumi" || member.title === "大泉匡史") ? (
                                                    <Link href="/members/masafumi-oizumi"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.4rem',
                                                            marginTop: '0.5rem',
                                                            fontSize: '0.9rem',
                                                            color: 'var(--color-primary)',
                                                            textDecoration: 'none',
                                                            padding: '0.3rem 0.8rem',
                                                            borderRadius: '20px',
                                                            background: 'var(--color-surface-alt)',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        className="hover:shadow-sm hover:bg-gray-200"
                                                    >
                                                        <Globe size={14} /> Website
                                                    </Link>
                                                ) : (
                                                    member.website && (
                                                        <a href={member.website} target="_blank" rel="noopener noreferrer"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.4rem',
                                                                marginTop: '0.5rem',
                                                                fontSize: '0.9rem',
                                                                color: 'var(--color-primary)',
                                                                textDecoration: 'none',
                                                                padding: '0.3rem 0.8rem',
                                                                borderRadius: '20px',
                                                                background: 'var(--color-surface-alt)',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            className="hover:shadow-sm hover:bg-gray-200"
                                                        >
                                                            <Globe size={14} /> Website
                                                        </a>
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <p>Please add the atmark g.ecc.u-tokyo.ac.jp to our email addresses.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
