import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { executeQuery } from "@/lib/db";

interface Article {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    content: string;
    category: string;
    image_url: string;
    published_at: string;
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const categoryName = name.charAt(0).toUpperCase() + name.slice(1);

    // Fetch articles from the view which joins Categories and Articles
    // Filter by the URL parameter 'name' against the 'category_slug' column
    const filter = JSON.stringify({ category_slug: name.toLowerCase() });
    const articles = await executeQuery(`news_articles_v?q=${encodeURIComponent(filter)}`) as Article[];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow max-w-[1200px] mx-auto px-6 py-12 w-full">
                <header className="border-b-2 border-black pb-4 mb-12">
                    <h1 className="text-5xl font-serif font-black uppercase tracking-tighter">{categoryName}</h1>
                    <p className="text-gray-500 mt-2 font-medium uppercase text-xs tracking-widest">Latest updates in {categoryName}</p>
                </header>

                {articles.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-serif text-gray-400">No articles found in this category.</h2>
                        <Link href="/" className="text-primary font-bold mt-4 inline-block hover:underline">Return Home</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {articles.map((article) => (
                            <article key={article.id} className="group cursor-pointer">
                                <Link href={`/article/${article.slug}`}>
                                    <div className="aspect-[16/10] bg-gray-100 mb-4 overflow-hidden relative">
                                        {article.image_url && (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 mt-3 line-clamp-3 text-sm leading-relaxed">
                                        {article.subtitle || article.content}
                                    </p>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
