import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t-4 border-primary mt-12">
            <div className="w-full max-w-[1600px] mx-auto px-6">

                {/* Brand & Social */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-8 mb-8">
                    <h2 className="text-3xl font-serif font-bold uppercase tracking-tight mb-4 md:mb-0">The News Point</h2>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></Link>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 text-sm text-gray-400">
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-4">News</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white">UK News</Link></li>
                            <li><Link href="#" className="hover:text-white">World News</Link></li>
                            <li><Link href="#" className="hover:text-white">Politics</Link></li>
                            <li><Link href="#" className="hover:text-white">Science</Link></li>
                            <li><Link href="#" className="hover:text-white">Health</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-4">Opinion</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white">Editorials</Link></li>
                            <li><Link href="#" className="hover:text-white">Columnists</Link></li>
                            <li><Link href="#" className="hover:text-white">Letters</Link></li>
                            <li><Link href="#" className="hover:text-white">Cartoons</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-4">Sport</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white">Football</Link></li>
                            <li><Link href="#" className="hover:text-white">Cricket</Link></li>
                            <li><Link href="#" className="hover:text-white">Rugby Union</Link></li>
                            <li><Link href="#" className="hover:text-white">Tennis</Link></li>
                            <li><Link href="#" className="hover:text-white">F1</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-4">Culture</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white">TV & Radio</Link></li>
                            <li><Link href="#" className="hover:text-white">Books</Link></li>
                            <li><Link href="#" className="hover:text-white">Film</Link></li>
                            <li><Link href="#" className="hover:text-white">Music</Link></li>
                            <li><Link href="#" className="hover:text-white">Art</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-4">Lifestyle</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white">Travel</Link></li>
                            <li><Link href="#" className="hover:text-white">Style</Link></li>
                            <li><Link href="#" className="hover:text-white">Luxury</Link></li>
                            <li><Link href="#" className="hover:text-white">Cars</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Legal */}
                <div className="text-center text-xs text-gray-500 pt-8 border-t border-gray-800">
                    <p className="mb-2">© 2026 The News Point Media Group Limited. All rights reserved.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="#" className="hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white">Cookie Policy</Link>
                        <Link href="#" className="hover:text-white">Terms and Conditions</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
