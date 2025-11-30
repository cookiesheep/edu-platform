'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTopHandler() {
    const pathname = usePathname();

    useEffect(() => {
        // 强制滚动到顶部的函数
        const scrollToTop = () => {
            // 立即滚动到顶部
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            // 查找并重置所有可能的滚动容器
            const scrollableElements = document.querySelectorAll(
                '[style*="overflow"], .overflow-auto, .overflow-y-auto, .overflow-x-auto, .overflow-scroll'
            );
            scrollableElements.forEach(element => {
                element.scrollTop = 0;
            });
        };

        // 立即执行
        scrollToTop();
        
        // 使用 requestAnimationFrame 确保在下一帧执行
        requestAnimationFrame(() => {
            scrollToTop();
        });
        
        // 延迟执行，确保页面内容已渲染
        const timer1 = setTimeout(() => {
            scrollToTop();
        }, 0);
        
        const timer2 = setTimeout(() => {
            scrollToTop();
        }, 100);
        
        const timer3 = setTimeout(() => {
            scrollToTop();
        }, 300);
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [pathname]);

    return null;
}
