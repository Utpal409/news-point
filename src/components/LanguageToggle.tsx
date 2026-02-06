'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function LanguageToggle() {
    const [lang, setLang] = useState('en');
    const router = useRouter();

    useEffect(() => {
        const savedLang = document.cookie.split('; ').find(row => row.startsWith('lang='))?.split('=')[1] || 'en';
        setLang(savedLang);
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === 'en' ? 'hi' : 'en';
        setLang(newLang);
        document.cookie = `lang=${newLang}; path=/; max-age=31536000`; // 1 year
        router.refresh();
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors group"
        >
            <span className={`text-[10px] font-bold uppercase tracking-wider ${lang === 'en' ? 'text-primary' : 'text-gray-400'}`}>
                EN
            </span>
            <div className="w-[1px] h-3 bg-gray-300" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${lang === 'hi' ? 'text-primary' : 'text-gray-400'}`}>
                हिन्दी
            </span>
        </button>
    );
}
