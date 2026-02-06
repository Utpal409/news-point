import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { executeQuery } from "@/lib/db";
import { notFound } from "next/navigation";
import {
    Facebook,
    Twitter,
    Linkedin,
    Mail,
    Share2
} from "lucide-react";
import { cookies } from "next/headers";

interface Article {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    content: string;
    category_name: string;
    category_name_hi: string;
    category_slug: string;
    image_url: string;
    author_id: number;
    published_at: string;
    tags?: string;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const lang = cookieStore.get('lang')?.value || 'en';

    // Fetch article from ORDS REST API (using the View)
    let items = await executeQuery('news_articles_v', { q: JSON.stringify({ slug: slug }) });

    // FALLBACK
    if (!items || items.length === 0) {
        items = await executeQuery('news_articles', { q: JSON.stringify({ slug: slug }) });
        // Add compatibility mapping
        items = items.map((a: any) => ({
            ...a,
            category_name: a.category || "News",
            category_name_hi: "समाचार",
            category_slug: (a.category || "news").toLowerCase()
        }));
    }

    const article = items.find((a: Article) => a.slug === slug);

    if (!article) {
        notFound();
    }

    const tags = article.tags ? article.tags.split(',') : ["News", "Updates"];

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Navbar />

            <main className="w-full max-w-[1000px] mx-auto px-6 py-12">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link href={`/category/${article.category_slug || 'news'}`} className="hover:text-primary">
                        {lang === 'hi' ? article.category_name_hi : article.category_name}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">Article</span>
                </div>

                {/* Headline Header */}
                <div className="mb-8 border-b border-gray-200 pb-8">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-gray-900 leading-tight mb-6">
                        {article.title}
                    </h1>
                    {article.subtitle && (
                        <p className="text-xl md:text-2xl text-gray-600 font-serif leading-relaxed mb-6 max-w-3xl">
                            {article.subtitle}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                {/* Avatar placeholder */}
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_id}`} alt="Avatar" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-primary uppercase tracking-wider">News Point Editor</div>
                                <div className="text-xs text-gray-500">
                                    {new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • {new Date(article.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"><Facebook className="w-5 h-5 text-[#1877F2]" /></button>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"><Twitter className="w-5 h-5 text-[#1DA1F2]" /></button>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"><Mail className="w-5 h-5 text-gray-600" /></button>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"><Share2 className="w-5 h-5 text-gray-600" /></button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content Article */}
                    <article className="lg:col-span-8">

                        {/* Main Feature Image */}
                        {article.image_url && (
                            <figure className="mb-8">
                                <div className="aspect-video w-full bg-gray-200 relative mb-3 overflow-hidden">
                                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                                </div>
                                <figcaption className="text-xs text-gray-500 font-sans border-b border-gray-100 pb-2">
                                    {article.title}. Credit: Global News Point
                                </figcaption>
                            </figure>
                        )}

                        <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-8 whitespace-pre-wrap">
                            <p className="first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-black first-letter:text-gray-900 first-line:uppercase first-line:tracking-widest mb-6">
                                {article.content}
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex gap-2 flex-wrap">
                                {tags.map(tag => (
                                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">

                        {/* Related Stories */}
                        <div className="bg-[#f9f9f9] p-6 border border-gray-200">
                            <h3 className="font-sans font-bold text-xs uppercase text-primary tracking-widest border-b-2 border-primary pb-2 mb-6">The News Point</h3>
                            <ul className="space-y-6">
                                <li className="group cursor-pointer">
                                    <h4 className="text-base font-serif font-bold leading-tight group-hover:text-primary mb-2">
                                        Subscribe to get the latest updates as they happen.
                                    </h4>
                                    <span className="text-xs text-gray-500 font-bold uppercase">Join 50k+ readers</span>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter Box */}
                        <div className="border border-primary p-6 text-center">
                            <h3 className="font-serif font-bold text-2xl mb-2">The Daily Briefing</h3>
                            <p className="text-sm text-gray-600 mb-4">Vital news and expert analysis, straight to your inbox every morning.</p>
                            <input type="email" placeholder="Your email address" className="w-full bg-gray-50 border border-gray-300 p-3 text-sm mb-3 focus:outline-none focus:border-primary" />
                            <button className="w-full bg-primary text-white font-bold uppercase text-xs tracking-widest py-3 hover:bg-[#044460]">Sign up free</button>
                        </div>

                    </aside>

                </div>
            </main>

            <Footer />
        </div>
    );
}
