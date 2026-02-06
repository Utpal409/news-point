import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { executeQuery } from "@/lib/db";
import { PlayCircle, MessageSquare } from "lucide-react";
import { cookies } from "next/headers";

// Define the Article Type based on NEW Normalized View
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
}

// Fetch data via ORDS REST API (using the View)
async function getArticles() {
  try {
    let items = await executeQuery('news_articles_v');

    // FALLBACK: If the specialized View is 404/Empty, try the base table
    if (!items || items.length === 0) {
      console.log("⚠️ View 'news_articles_v' not found/empty, falling back to 'news_articles'");
      items = await executeQuery('news_articles');

      // Map old 'category' field to 'category_name' for compatibility
      return items.map((a: any) => ({
        ...a,
        category_name: a.category || "News",
        category_name_hi: "समाचार", // Generic fallback
        category_slug: (a.category || "news").toLowerCase()
      })) as Article[];
    }

    return items as Article[];
  } catch (error) {
    console.error("Failed to fetch articles from ORDS:", error);
    return [];
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'en';
  const articles = await getArticles();

  // Distribute articles for layout without duplication
  const mainStory = articles[0]; // Hero
  const latestSidebar = articles.slice(1, 6); // Left Sidebar
  const subHeroGrid = articles.slice(6, 8); // Two featured under hero
  const trendingSidebar = articles.slice(8, 12); // Right Sidebar
  const moreStories = articles.slice(12); // Bottom Grid

  // If no DB data, show fallback (or handle empty state)
  if (!mainStory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Database Connected!</h1>
        <p>No articles found. Run `node scripts/setup-db.js` to seed data.</p>
        <Link href="/" className="mt-4 text-primary underline">Reload</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="w-full max-w-[1600px] mx-auto px-6 py-8">

        {/* Top Grid: Hero + Sidebars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">

          {/* Left Column: Briefing / Lists (Width: 2/12) */}
          <div className="hidden lg:block lg:col-span-2 space-y-6 pr-4">
            <h3 className="font-sans font-bold text-xs uppercase text-primary tracking-widest border-b-2 border-primary pb-1 mb-4">Latest News</h3>
            <ul className="space-y-4">
              {latestSidebar.map((story) => (
                <li key={story.id} className="group cursor-pointer">
                  <Link href={`/article/${story.slug}`}>
                    <span className="text-[10px] text-gray-500 font-bold block mb-1">
                      {new Date(story.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <h4 className="text-sm font-serif font-medium leading-snug group-hover:text-primary transition-colors line-clamp-3">
                      {story.title}
                    </h4>
                  </Link>
                </li>
              ))}
              {latestSidebar.length === 0 && <p className="text-xs text-gray-400 italic">More news coming soon...</p>}
            </ul>
          </div>

          {/* Center Column: Hero Story (Width: 6/12) */}
          <div className="lg:col-span-12 lg:lg:col-span-7 px-0 lg:px-8">
            <article className="mb-8 group cursor-pointer">
              <div className="relative aspect-[3/2] w-full mb-4 overflow-hidden bg-gray-200">
                {mainStory.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={mainStory.image_url} alt={mainStory.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-gray-700" />
                )}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <span className="bg-primary text-white text-xs font-bold uppercase px-2 py-1 tracking-wider">
                    {lang === 'hi' ? mainStory.category_name_hi : mainStory.category_name}
                  </span>
                </div>
              </div>
              <Link href={`/article/${mainStory.slug}`}>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4 group-hover:text-primary transition-colors">
                  {mainStory.title}
                </h1>
              </Link>
              <p className="text-lg text-gray-600 font-serif leading-relaxed mb-4 line-clamp-3">
                {mainStory.content}
              </p>
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-gray-500 uppercase">
                <span className="text-primary">Utpal</span> <span>in News</span>
              </div>
            </article>

            {/* Sub-hero grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
              {subHeroGrid.map((story) => (
                <article key={story.id} className="group cursor-pointer">
                  <Link href={`/article/${story.slug}`}>
                    <div className="aspect-video bg-gray-200 mb-3 relative overflow-hidden">
                      {story.image_url && <img src={story.image_url} alt={story.title} className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-xs font-bold text-primary uppercase mb-1 block">
                      {lang === 'hi' ? story.category_name_hi : story.category_name}
                    </span>
                    <h3 className="text-xl font-serif font-bold leading-tight group-hover:text-primary mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{story.subtitle || story.content}</p>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column: Opinion / Comment (Width: 3/12) */}
          <div className="lg:col-span-3 pl-0 lg:pl-6 space-y-8 pt-8 lg:pt-0">
            <div>
              <h3 className="font-sans font-bold text-xs uppercase text-primary tracking-widest border-b-2 border-primary pb-1 mb-4">Trending</h3>
              <div className="space-y-6">
                {trendingSidebar.map((story) => (
                  <article key={story.id} className="group cursor-pointer">
                    <Link href={`/article/${story.slug}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                          {/* Avatar placeholder */}
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${story.author_id}`} alt="Avatar" />
                        </div>
                        <span className="text-xs font-bold uppercase text-gray-500">
                          News Desk
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {story.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-1 text-xs text-primary font-bold hover:underline">
                        <MessageSquare className="w-3 h-3" /> <span>{story.id * 5} comments</span>
                      </div>
                    </Link>
                  </article>
                ))}
                {trendingSidebar.length === 0 && <p className="text-xs text-gray-400 italic">No trending items yet.</p>}
              </div>
            </div>

            <div className="bg-[#fffdf5] border border-gray-200 p-4">
              <h3 className="font-sans font-bold text-xs uppercase text-gray-500 tracking-widest mb-2">News Point Premium</h3>
              <h4 className="text-xl font-serif font-bold mb-2">The daily crossword</h4>
              <p className="text-sm text-gray-600 mb-4">Challenge yourself with our cryptic and quick puzzles.</p>
              <button className="w-full bg-white border border-gray-300 text-xs font-bold uppercase py-2 hover:bg-gray-50">Play now</button>
            </div>
          </div>
        </div>

        {/* Full width divider */}
        <div className="border-t-2 border-black my-12" />

        {moreStories.length > 0 && (
          <section>
            <h2 className="text-3xl font-serif font-bold text-center mb-8">More Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {moreStories.map((story) => (
                <article key={story.id} className="group cursor-pointer">
                  <Link href={`/article/${story.slug}`}>
                    <div className="aspect-[4/5] bg-gray-100 mb-3 relative overflow-hidden">
                      {story.image_url && <img src={story.image_url} alt={story.title} className="w-full h-full object-cover transition-opacity hover:opacity-90" />}
                    </div>
                    <h4 className="text-xs font-sans font-bold text-accent uppercase tracking-wider mb-2">
                      {lang === 'hi' ? story.category_name_hi : story.category_name}
                    </h4>
                    <h3 className="text-xl font-serif font-bold leading-snug group-hover:underline decoration-2 underline-offset-4 decoration-primary mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
