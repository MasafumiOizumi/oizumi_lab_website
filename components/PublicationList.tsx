import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Publication {
    id: string;
    title: string;
    authors: string[];
    journal: string;
    year: number;
    url?: string;
    tags?: string[];
}

export default function PublicationList({ publications }: { publications: Publication[] }) {
    // Group by year
    const groupedPublications = publications.reduce((acc, pub) => {
        (acc[pub.year] = acc[pub.year] || []).push(pub);
        return acc;
    }, {} as Record<number, Publication[]>);

    const years = Object.keys(groupedPublications).map(Number).sort((a, b) => b - a);

    return (
        <div className="space-y-12">
            {years.map((year) => (
                <div key={year}>
                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">{year}</h3>
                    <ul className="space-y-6">
                        {groupedPublications[year].map((pub) => (
                            <li key={pub.id} className="bg-white shadow sm:rounded-lg p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900">{pub.title}</h4>
                                        <p className="mt-1 text-sm text-gray-600">{pub.authors.join(", ")}</p>
                                        <p className="mt-1 text-sm text-indigo-600 italic">{pub.journal}</p>
                                        {pub.tags && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {pub.tags.map(tag => (
                                                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {pub.url && (
                                        <Link href={pub.url} target="_blank" className="ml-4 flex-shrink-0 text-indigo-600 hover:text-indigo-500">
                                            <ExternalLink className="h-5 w-5" />
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
