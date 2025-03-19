'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import AIAssistant from '@/components/ui/AIAssistant'; // 如果已经实现则取消注释

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function MainLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* 顶部导航 */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="flex items-center">
                    <img
                        src="/logo.svg"
                        alt="EduPlatform"
                        className="h-8 w-8 mr-2"
                    />
                    <span className="text-2xl font-bold text-primary-600">EduPlatform</span>
                  </Link>
                </div>
                <nav className="ml-6 flex space-x-8">
                  <Link
                      href="/"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          pathname === '/'
                              ? 'border-primary-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    首页
                  </Link>
                  <Link
                      href="/courses"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          pathname === '/courses' || pathname.startsWith('/courses/')
                              ? 'border-primary-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    课程
                  </Link>
                  <Link
                      href="/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          pathname === '/dashboard'
                              ? 'border-primary-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    仪表盘
                  </Link>
                  <Link
                      href="/practice"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          pathname === '/practice'
                              ? 'border-primary-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    练习
                  </Link>
                  <Link
                      href="/analytics"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          pathname === '/analytics'
                              ? 'border-primary-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    分析
                  </Link>
                </nav>
              </div>

              {/* 用户菜单 */}
              <div className="flex items-center">
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
                          className="text-sm px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200"
                      >
                        退出
                      </button>
                    </div>
                ) : (
                    <Link href="/login" className="text-sm px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 transition duration-200">
                      登录
                    </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* 页脚 */}
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex justify-center md:justify-start">
                <Link href="/" className="flex items-center">
                  <img
                      src="/logo.svg"
                      alt="EduPlatform"
                      className="h-6 w-6 mr-2"
                  />
                  <span className="text-lg font-bold text-primary-600">EduPlatform</span>
                </Link>
              </div>
              <div className="mt-8 md:mt-0 flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">关于我们</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <p className="mt-8 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} EduPlatform. 大创项目.
            </p>
          </div>
        </footer>

        {/* AI助手组件 - 如果已实现 */}
        { <AIAssistant /> }
      </div>
  );
}