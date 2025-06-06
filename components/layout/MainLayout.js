// components/layout/MainLayout.js
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import Header from './Header';
import Footer from './Footer';
import AIAssistant from '@/components/ui/AIAssistant';

export default function MainLayout({ children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        }
        getUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            
            {/* AI助手组件，确保在所有页面上可用 */}
            <AIAssistant />
        </div>
    );
}