import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function MainLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    }
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  EduPlatform
                </Link>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link href="/" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700">
                  首页
                </Link>
                <Link href="/courses" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700">
                  课程
                </Link>
                <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700">
                  仪表盘
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-4">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
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
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EduPlatform. 大创项目.
          </p>
        </div>
      </footer>
    </div>
  );
}
