import Image from "next/image";
import Link from "next/link";
import { Globe, Twitter } from "lucide-react";

interface Member {
    id: string;
    name: string;
    role: string;
    image: string;
    description: string;
    links?: {
        website?: string;
        twitter?: string;
    };
}

export default function MemberCard({ member }: { member: Member }) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-20 w-20 relative">
                        {/* Placeholder image if no image provided */}
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            {member.image ? (
                                <span className="text-xs">Image</span> // In real app, use next/image
                            ) : (
                                <span className="text-2xl">{member.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                    <div className="ml-5">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {member.name}
                        </h3>
                        <p className="text-sm text-indigo-600">{member.role}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">{member.description}</p>
                </div>
                <div className="mt-4 flex space-x-3">
                    {member.links?.website && (
                        <Link href={member.links.website} target="_blank" className="text-gray-400 hover:text-gray-500">
                            <Globe className="h-5 w-5" />
                        </Link>
                    )}
                    {member.links?.twitter && (
                        <Link href={member.links.twitter} target="_blank" className="text-gray-400 hover:text-gray-500">
                            <Twitter className="h-5 w-5" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
