'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function MobileOptimizedLayout({ children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        async function getUser() {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);

            const { data: authListener } = supabase.auth.onAuthStateChange(
                (event, session) => {
                    setUser(session?.user || null);
                }
            );

            return () => {
                authListener?.subscription.unsubscribe();
            };
        }

        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // Close mobile menu when changing routes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Define navigation items
    const navigationItems = [
        { name: '首页', href: '/', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ) },
        { name: '课程', href: '/courses', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ) },
        { name: '仪表盘', href: '/dashboard', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ) },
        { name: '练习', href: '/practice', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ) },
        { name: '分析', href: '/analytics', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ) }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Top navigation bar */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and desktop navigation */}
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="flex items-center">
                                    <img
                                        src="/logo.svg"
                                        alt="EduPlatform"
                                        className="h-8 w-8 mr-2"
                                    />
                                    <span className="text-2xl font-bold text-primary-600 hidden sm:inline-block">EduPlatform</span>
                                </Link>
                            </div>

                            {/* Desktop navigation - hidden on mobile */}
                            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigationItems.map(item => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            pathname === item.href
                                                ? 'border-primary-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Mobile menu button */}
                        <div className="sm:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-500 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>

                        {/* Desktop user menu - hidden on mobile */}
                        <div className="hidden sm:flex sm:items-center">
                            {loading ? (
                                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                            ) : user ? (
                                <div className="flex items-center">
                                    <Link href="/profile" className="flex items-center mr-4 text-sm text-gray-700">
                                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2 font-medium">
                                            {user.email ? user.email[0].toUpperCase() : '?'}
                                        </div>
                                        <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-sm px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    >
                                        退出
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="text-sm px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">
                                    登录
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile menu - shown/hidden based on state */}
            <div className={`sm:hidden fixed inset-0 z-40 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                {/* Background overlay */}
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>

                {/* Mobile menu content */}
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    {/* Mobile menu header */}
                    <div className="pt-5 pb-4">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center">
                                <img
                                    src="/logo.svg"
                                    alt="EduPlatform"
                                    className="h-8 w-8 mr-2"
                                />
                                <span className="text-xl font-bold text-primary-600">EduPlatform</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-500 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* User info (mobile) */}
                        {user && (
                            <div className="px-4 pt-4 border-t border-gray-200 mt-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3 font-medium">
                                        {user.email ? user.email[0].toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.email?.split('@')[0]}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile navigation menu */}
                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navigationItems.map(item => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-3 text-base font-medium rounded-md ${
                                        pathname === item.href
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`mr-4 ${
                                        pathname === item.href ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-600'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile login/logout */}
                        <div className="pt-4 pb-3 border-t border-gray-200 mt-4 px-2">
                            {user ? (
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center px-2 py-3 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    退出登录
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full flex items-center px-2 py-3 text-base font-medium rounded-md text-primary-600 hover:bg-primary-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    登录/注册
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dummy element to force sidebar to shrink to fit close button */}
                <div className="flex-shrink-0 w-14"></div>
            </div>

            {/* Main content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Bottom mobile navigation bar - only on small screens */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
                <div className="grid grid-cols-5 h-16">
                    {navigationItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center px-1 text-xs ${
                                pathname === item.href
                                    ? 'text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className={`h-6 w-6 mb-1 ${
                                pathname === item.href ? 'text-primary-600' : 'text-gray-500'
                            }`}>
                                {item.icon}
                            </div>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer - hidden on small screens */}
            <footer className="bg-white border-t border-gray-200 hidden sm:block">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} EduPlatform. 大创项目.
                    </p>
                </div>
            </footer>

            {/* Add bottom padding on mobile to account for the navigation bar */}
            <div className="h-16 sm:hidden"></div>
        </div>
    );
}