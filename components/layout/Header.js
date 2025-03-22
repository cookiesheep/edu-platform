'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, User, LogOut, Home, BookOpen, PieChart, Bot, Map } from 'lucide-react';
import supabase from '@/lib/supabaseClient';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const pathname = usePathname();

    // 获取用户信息
    useEffect(() => {
        async function getUser() {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        }
        getUser();
    }, []);

    // 导航列表，添加AI助手入口
    const navItems = [
        { name: '首页', href: '/', icon: <Home size={16} className="mr-1.5" /> },
        { name: '课程', href: '/courses', icon: <BookOpen size={16} className="mr-1.5" /> },
        { name: '学习分析', href: '/analytics', icon: <PieChart size={16} className="mr-1.5" /> },
        { name: 'AI助手', href: '/ai-assistant', icon: <Bot size={16} className="mr-1.5" /> },
        { name: '学习路径', href: '/learning-path', icon: <Map size={16} className="mr-1.5" /> },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo和站点名称 */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image 
                                src="/logo.svg" 
                                alt="EduPlatform Logo" 
                                width={36} 
                                height={36}
                                className="rounded-md"
                                priority
                            />
                            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 text-transparent bg-clip-text">
                                EduPlatform
                            </span>
                        </Link>
                    </div>

                    {/* 桌面端导航 */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 
                                    ${pathname === item.href
                                    ? 'text-primary-600 bg-primary-50'
                                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
                                } relative group overflow-hidden flex items-center`}
                            >
                                {item.icon}
                                {item.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}

                        {/* 用户头像或登录按钮 */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-1 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <ChevronDown size={16} className={`transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* 用户下拉菜单 */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            个人资料
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <LogOut size={16} className="mr-2" />
                                                退出登录
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-300"
                            >
                                登录 / 注册
                            </Link>
                        )}
                    </nav>

                    {/* 移动端菜单按钮 */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 移动端菜单 */}
            {isOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    pathname === item.href
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                                } transition-colors flex items-center`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                        {!user && (
                            <Link
                                href="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors text-center mt-4"
                                onClick={() => setIsOpen(false)}
                            >
                                登录 / 注册
                            </Link>
                        )}
                        {user && (
                            <>
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    个人资料
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    退出登录
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}