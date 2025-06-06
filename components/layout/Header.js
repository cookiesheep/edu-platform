'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Menu, X, ChevronDown, User, LogOut, Home, BookOpen, 
    Bot, Brain, FileQuestion, Star, Bell, Search,
    Sparkles, Zap, Shield, Settings, HelpCircle, Target, FileText
} from 'lucide-react';
import supabase from '@/lib/supabaseClient';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // 监听滚动效果
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 获取用户信息
    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    console.log('获取用户信息失败:', error.message);
                } else {
                    setUser(user);
                }
            } catch (error) {
                console.log('认证服务连接失败');
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 退出登录
    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setShowUserMenu(false);
        } catch (error) {
            console.log('退出登录失败');
        }
    };

    // 导航菜单项
    const navItems = [
        { 
            href: '/', 
            label: '首页', 
            icon: <Home size={18} />,
            gradient: 'from-blue-500 to-cyan-500'
        },
        { 
            href: '/courses', 
            label: '课程学习', 
            icon: <BookOpen size={18} />,
            gradient: 'from-purple-500 to-pink-500'
        },
        { 
            href: '/quiz-generator', 
            label: '智能出题+评估', 
            icon: <Brain size={18} />,
            gradient: 'from-emerald-500 to-green-500',
            isHot: true
        },
        { 
            href: '/learning-path', 
            label: '学习路径', 
            icon: <Target size={18} />,
            gradient: 'from-orange-500 to-red-500'
        },
        { 
            href: '/content-generator', 
            label: '学习内容生成', 
            icon: <FileText size={18} />,
            gradient: 'from-indigo-500 to-purple-500'
        }
    ];

    const isActive = (href) => pathname === href;

    return (
        <motion.header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
                    : 'bg-transparent'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div 
                        className="flex items-center space-x-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <Link href="/" className="flex items-center space-x-3 group">
                            <motion.div 
                                className="relative"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                            </motion.div>
                            <div className="flex flex-col">
                                <span className={`text-xl font-bold transition-colors duration-300 ${
                                    scrolled ? 'text-gray-900' : 'text-white'
                                } group-hover:text-blue-600`}>
                                    EduPlatform
                                </span>
                                <span className={`text-xs transition-colors duration-300 ${
                                    scrolled ? 'text-gray-500' : 'text-gray-200'
                                }`}>
                                    智能学习平台
                                </span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* 桌面导航菜单 */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link 
                                    href={item.href}
                                    className={`relative group flex items-center space-x-2 px-4 py-2 pr-8 rounded-xl font-medium transition-all duration-300 overflow-visible ${
                                        isActive(item.href)
                                            ? scrolled
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-white bg-white/20 backdrop-blur-sm'
                                            : scrolled
                                                ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                : 'text-gray-200 hover:text-white hover:bg-white/20'
                                    }`}
                                >
                                    {/* 悬停背景效果 - 在底层 */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity -z-10`}
                                        layoutId={`nav-bg-${item.href}`}
                                    />
                                    
                                    {/* 图标和文字 - 在顶层 */}
                                    <motion.div
                                        className="relative z-10 flex items-center space-x-2"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            {item.icon}
                                        </motion.div>
                                        <span className="font-medium">{item.label}</span>
                                    </motion.div>
                                    
                                    {/* 热门标签 */}
                                    {item.isHot && (
                                        <motion.span 
                                            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg z-20 whitespace-nowrap"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            HOT
                                        </motion.span>
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* 右侧操作区 */}
                    <div className="flex items-center space-x-3">
                        {/* 搜索按钮 */}
                        <motion.button
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                scrolled
                                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                    : 'text-gray-200 hover:text-white hover:bg-white/20'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search size={20} />
                        </motion.button>

                        {/* 通知按钮 */}
                        <motion.button
                            className={`relative p-2 rounded-lg transition-all duration-300 ${
                                scrolled
                                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                    : 'text-gray-200 hover:text-white hover:bg-white/20'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        </motion.button>

                        {/* 用户菜单 */}
                        {user ? (
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                                        scrolled
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-white hover:bg-white/20'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <ChevronDown size={16} className={`transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                                </motion.button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                                        >
                                            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{user.email || '用户'}</div>
                                                        <div className="text-sm opacity-80">个人账户</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="p-2">
                                                <Link 
                                                    href="/profile"
                                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <User size={18} />
                                                    <span>个人资料</span>
                                                </Link>
                                                <Link 
                                                    href="/dashboard"
                                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <Settings size={18} />
                                                    <span>学习统计</span>
                                                </Link>
                                                <button 
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut size={18} />
                                                    <span>退出登录</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link 
                                        href="/login"
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                            scrolled
                                                ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                : 'text-gray-200 hover:text-white hover:bg-white/20'
                                        }`}
                                    >
                                        登录
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link 
                                        href="/register"
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        注册
                                    </Link>
                                </motion.div>
                            </div>
                        )}

                        {/* 移动端菜单按钮 */}
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                                scrolled
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-white hover:bg-white/20'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isOpen ? 'close' : 'menu'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* 移动端菜单 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50"
                    >
                        <div className="px-4 py-6 space-y-3">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link 
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                            isActive(item.href)
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            {item.icon}
                                        </motion.div>
                                        <span className="font-medium">{item.label}</span>
                                        {item.isHot && (
                                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">
                                                HOT
                                            </span>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                            
                            {!user && (
                                <div className="pt-4 border-t border-gray-200 space-y-3">
                                    <Link 
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-all"
                                    >
                                        登录
                                    </Link>
                                    <Link 
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
                                    >
                                        注册
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}