'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white py-16 md:py-24">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-repeat"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-20"></div>
            </div>
            
            {/* 浮动图形 */}
            <div className="absolute top-1/4 left-10 w-16 h-16 border-2 border-white/20 rounded-lg transform rotate-12 animate-float opacity-20"></div>
            <div className="absolute bottom-1/4 right-10 w-20 h-20 border-2 border-white/20 rounded-full transform -rotate-12 animate-float-slow opacity-20"></div>
            <div className="absolute top-3/4 left-1/3 w-10 h-10 border-2 border-white/20 rounded-md transform rotate-45 animate-float-slower opacity-20"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center">
                    <motion.div 
                        className="md:w-1/2 mb-12 md:mb-0 md:pr-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* 统一的背景矩形 */}
                        <motion.div 
                            className="absolute -left-4 -top-4 w-[110%] h-[105%] bg-gradient-to-r from-blue-800/30 to-indigo-700/30 rounded-xl -z-10 shadow-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        />
                        
                        <motion.h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight relative"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* "用AI重新定义"部分 */}
                            <motion.span 
                                className="inline-block relative z-10 text-white font-extrabold mb-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                用<motion.span 
                                    className="text-yellow-300 inline-block font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" 
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                >AI</motion.span>重新定义
                            </motion.span>
                            
                            {/* "学习体验"部分 */}
                            <motion.span 
                                className="inline-block relative z-10 text-white ml-2 font-extrabold drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                学习体验
                            </motion.span>
                        </motion.h1>
                        
                        <motion.div
                            className="relative mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <p className="text-lg md:text-xl lg:text-2xl font-medium pl-4 pr-5 py-3 leading-relaxed text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] tracking-wide">
                                智能个性化学习系统，打造适合每位学生的专属学习路径，提升学习效率和学习成果。
                            </p>
                        </motion.div>
                        
                        <div className="flex flex-wrap gap-4">
                            <Link 
                                href="/courses" 
                                className="group relative overflow-hidden bg-white text-primary-700 hover:text-primary-800 px-8 py-3 rounded-lg font-bold text-lg flex items-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                            >
                                <span className="relative z-10">开始学习</span>
                                <span className="absolute bottom-0 left-0 w-full h-0 bg-yellow-200 transition-all duration-300 group-hover:h-full -z-0"></span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link 
                                href="/ai-assistant" 
                                className="group relative px-8 py-3 rounded-lg font-bold text-lg flex items-center border border-white/40 transition-all overflow-hidden shadow-lg bg-blue-700/60 backdrop-blur-sm hover:bg-blue-600/70"
                            >
                                <span className="relative z-10">AI助手</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                            </Link>
                        </div>
                        
                        {/* 特性标签 */}
                        <div className="flex flex-wrap gap-3 mt-10">
                            {["智能评估", "个性化学习路径", "智能题目生成"].map((feature, index) => (
                                <motion.span 
                                    key={feature}
                                    className="bg-blue-800/60 backdrop-blur-md text-white text-sm px-5 py-2 rounded-full shadow-lg relative overflow-hidden group border border-blue-500/50 font-medium"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                >
                                    <motion.span 
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    ></motion.span>
                                    <span className="relative z-10 drop-shadow-sm">{feature}</span>
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="md:w-1/2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-2 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
                            <img
                                src="/hero-image.svg" 
                                alt="智能学习平台"
                                className="w-full rounded-lg relative z-10"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/600x400/667EEA/FFFFFF/png?text=AI%20学习平台';
                                }}
                            />
                            {/* 装饰效果 */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/30 rounded-full filter blur-xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-500/30 rounded-full filter blur-xl"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* 底部波浪装饰 */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 text-white">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" opacity=".25"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="currentColor" opacity=".5"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                </svg>
            </div>
        </section>
    );
}