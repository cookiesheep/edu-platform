// components/layout/MainLayout.js
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import Header from './Header';
import Footer from './Footer';
import AIAssistant from '@/components/ui/AIAssistant';
import ScrollToTopHandler from '@/components/ScrollToTopHandler';

import ParticleVortex from '@/components/ui/ParticleVortex';

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

    // 页面切换时强制滚动到顶部
    useEffect(() => {
        // 立即滚动到顶部
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // 延迟执行，确保页面内容已渲染
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col relative">
            <ScrollToTopHandler />
            {/* 全局粒子背景 - z-index设置为0，内容z-index设置为10 */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ParticleVortex />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>

            {/* AI助手组件，确保在所有页面上可用 */}
            <AIAssistant />
        </div>
    );
}