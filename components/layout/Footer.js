'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Mail, Phone, MapPin, Heart, ExternalLink,
    Github, Twitter, Linkedin, Instagram,
    ArrowUp, Zap, Star, Sparkles,
    BookOpen, Bot, FileQuestion, Target,
    Users, Award, TrendingUp, Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
    const [showBackToTop, setShowBackToTop] = useState(false);

    // 监听滚动，显示回到顶部按钮
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 回到顶部
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 快速链接
    const quickLinks = [
        { href: '/', label: '首页', icon: <BookOpen size={16} /> },
        { href: '/courses', label: '课程学习', icon: <BookOpen size={16} /> },
        { href: '/quiz-generator', label: 'AI出题', icon: <FileQuestion size={16} /> },
        { href: '/ai-assistant', label: 'AI助手', icon: <Bot size={16} /> },
        { href: '/learning-path', label: '学习路径', icon: <Target size={16} /> }
    ];

    // 产品功能
    const features = [
        { label: '智能试题生成', icon: <Zap size={16} /> },
        { label: 'AI学习助手', icon: <Bot size={16} /> },
        { label: '个性化学习', icon: <Users size={16} /> },
        { label: '学习路径规划', icon: <Target size={16} /> },
        { label: '智能评估', icon: <Award size={16} /> }
    ];

    // 社交媒体链接
    const socialLinks = [
        { href: '#', icon: <Github size={20} />, label: 'GitHub', color: 'hover:text-white' },
        { href: '#', icon: <Twitter size={20} />, label: 'Twitter', color: 'hover:text-cyan-400' },
        { href: '#', icon: <Linkedin size={20} />, label: 'LinkedIn', color: 'hover:text-blue-500' },
        { href: '#', icon: <Instagram size={20} />, label: 'Instagram', color: 'hover:text-pink-500' }
    ];

    // 联系信息
    const contactInfo = [
        { icon: <Mail size={16} />, label: 'support@eduplatform.com', href: 'mailto:support@eduplatform.com' },
        { icon: <Phone size={16} />, label: '+86 400-123-4567', href: 'tel:+864001234567' },
        { icon: <MapPin size={16} />, label: '北京市朝阳区科技园区', href: '#' }
    ];

    return (
        <footer className="relative bg-[#020617] border-t border-white/5 text-slate-300 overflow-hidden">
            {/* 装饰背景 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* 主要内容 */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
                    {/* 品牌介绍 */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <motion.div
                                className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Sparkles className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    EduPlatform
                                </h3>
                                <p className="text-sm text-slate-500">智能学习平台</p>
                            </div>
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            基于先进AI技术，为每位学习者提供个性化学习体验。我们致力于让学习更智能、更高效、更有趣。
                        </p>

                        {/* 社交媒体链接 */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className={`p-3 bg-white/5 rounded-lg text-slate-400 ${social.color} transition-all hover:bg-white/10`}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* 快速链接 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                            <BookOpen size={20} className="mr-2 text-cyan-400" />
                            快速导航
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <motion.li
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="group flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            {link.icon}
                                        </motion.div>
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.label}
                                        </span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* 产品功能 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                            <Star size={20} className="mr-2 text-purple-400" />
                            核心功能
                        </h4>
                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={feature.label}
                                    className="flex items-center space-x-2 text-slate-400"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ x: 5 }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                        className="text-purple-400"
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <span>{feature.label}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* 联系方式 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                            <Mail size={20} className="mr-2 text-emerald-400" />
                            联系我们
                        </h4>
                        <ul className="space-y-4">
                            {contactInfo.map((contact, index) => (
                                <motion.li
                                    key={contact.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <a
                                        href={contact.href}
                                        className="group flex items-start space-x-3 text-slate-400 hover:text-emerald-400 transition-colors"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                            className="mt-0.5"
                                        >
                                            {contact.icon}
                                        </motion.div>
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {contact.label}
                                        </span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>

                        {/* 友情提示 */}
                        <motion.div
                            className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <Heart size={16} className="text-red-400" />
                                <span className="text-sm font-medium text-white">温馨提示</span>
                            </div>
                            <p className="text-sm text-slate-400">
                                学习有困难？随时联系我们的AI助手，获得24/7在线帮助！
                            </p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* 统计数据展示 */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {[
                        { number: "50,000+", label: "活跃用户", icon: <Users size={24} />, color: "text-cyan-400" },
                        { number: "1,000+", label: "精品课程", icon: <BookOpen size={24} />, color: "text-purple-400" },
                        { number: "98%", label: "满意度", icon: <Award size={24} />, color: "text-emerald-400" },
                        { number: "24/7", label: "在线服务", icon: <Shield size={24} />, color: "text-yellow-400" }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-3 group-hover:bg-white/10 transition-all`}>
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className={stat.color}
                                >
                                    {stat.icon}
                                </motion.div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* 底部版权信息 */}
                <motion.div
                    className="border-t border-white/10 pt-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-2 text-slate-500">
                            <span>© 2024 EduPlatform.</span>
                            <span>由</span>
                            <Heart size={16} className="text-red-500 animate-pulse" />
                            <span>精心打造</span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                隐私政策
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                服务条款
                            </Link>
                            <Link href="/help" className="hover:text-white transition-colors">
                                帮助中心
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 回到顶部按钮 */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/30 transition-all z-50"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <ArrowUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </footer>
    );
}