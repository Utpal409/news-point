import Link from "next/link";
import { Search, Menu, User } from "lucide-react";
import { executeQuery } from "@/lib/db";
import { LanguageToggle } from "./LanguageToggle";
import { cookies } from "next/headers";

interface Category {
    id: number;
    slug: string;
    name_en: string;
    name_hi: string;
}

export async function Navbar() {
    const cookieStore = await cookies();
    const lang = cookieStore.get('lang')?.value || 'en';

    let categories: Category[] = [];
    try {
        categories = await executeQuery('news_categories');
    } catch (e) {
        console.error("Failed to fetch categories:", e);
    }

    // Fallback if DB fetch fails
    if (categories.length === 0) {
        categories = [
            { id: 1, slug: 'space', name_en: 'Space', name_hi: 'अंतरिक्ष' },
            { id: 2, slug: 'tech', name_en: 'Tech', name_hi: 'तकनीकी' }
        ];
    }

    return (
        <header className="w-full bg-white font-sans border-b-4 border-primary">
            {/* Top Utility Bar */}
            <div className="bg-[#f5f5f5] text-xs border-b border-gray-200">
                <div className="w-full max-w-[1600px] mx-auto px-6 flex justify-between items-center h-8">
                    <div className="flex gap-4 text-gray-600">
                        <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span>Today's paper</span>
                    </div>
                    <div className="flex gap-4 font-bold text-gray-700 items-center">
                        <LanguageToggle />
                        <Link href="#" className="hover:text-primary">Login</Link>
                        <Link href="#" className="hover:text-primary">Register</Link>
                        <Link href="#" className="text-primary">Subscribe now</Link>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1600px] mx-auto px-6 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-1/3">
                    <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary group">
                        <Menu className="h-5 w-5 text-gray-900 group-hover:text-primary" />
                        <span className="hidden sm:inline">Sections</span>
                    </button>
                    <button>
                        <Search className="h-5 w-5 text-gray-600 hover:text-primary" />
                    </button>
                </div>

                <div className="w-full md:w-1/3 flex justify-center">
                    <Link href="/" className="group">
                        <h1 className="text-3xl md:text-5xl font-black font-serif text-center uppercase tracking-tight text-gray-900 group-hover:opacity-90 transition-opacity">
                            The News Point
                        </h1>
                    </Link>
                </div>

                <div className="w-full md:w-1/3 flex justify-end items-center gap-4">
                    <button className="bg-primary hover:bg-[#044460] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="border-t border-b border-gray-200 py-3 hidden md:block">
                <div className="w-full max-w-[1600px] mx-auto px-6 flex justify-center gap-8 text-sm font-bold uppercase tracking-wider text-gray-800">
                    <Link href="/" className="hover:text-primary hover:underline decoration-2 underline-offset-4">
                        {lang === 'hi' ? 'होम' : 'Home'}
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="hover:text-primary hover:underline decoration-2 underline-offset-4"
                        >
                            {lang === 'hi' ? cat.name_hi : cat.name_en}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}
