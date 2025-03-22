'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-md shadow-sm mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 平台简介 */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 text-transparent bg-clip-text mb-4">EduPlatform</h3>
            <p className="text-gray-600 text-sm mb-4">
              EduPlatform是一个AI驱动的智能教育平台，致力于提供个性化学习体验，帮助学生高效学习。
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contact@eduplatform.com" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* 链接 - 产品 */}
          <div className="col-span-1">
            <h4 className="text-md font-semibold text-gray-900 mb-4">产品</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  课程学习
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  AI助手
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  学习分析
                </Link>
              </li>
              <li>
                <Link href="/learning-path" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  学习路径
                </Link>
              </li>
            </ul>
          </div>

          {/* 链接 - 关于 */}
          <div className="col-span-1">
            <h4 className="text-md font-semibold text-gray-900 mb-4">关于我们</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  关于平台
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  团队介绍
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  加入我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 链接 - 资源 */}
          <div className="col-span-1">
            <h4 className="text-md font-semibold text-gray-900 mb-4">资源</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  学习博客
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  使用条款
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} EduPlatform. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
} 