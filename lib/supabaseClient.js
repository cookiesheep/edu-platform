import { createClient } from '@supabase/supabase-js';

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'your-anon-key';

// 全局单例，确保整个应用只有一个Supabase客户端实例
let supabaseInstance = null;

// 检查是否是真实的Supabase配置
const isRealSupabase = supabaseUrl !== 'https://your-project.supabase.co' && 
                      supabaseKey !== 'your-anon-key' &&
                      supabaseUrl.includes('supabase.co') &&
                      supabaseUrl.length > 30 &&
                      supabaseKey.length > 30;

function createSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (isRealSupabase) {
    // 使用真实的Supabase客户端
    console.log('初始化Supabase客户端...');
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } else {
    // 使用模拟客户端，避免在没有真实配置时产生错误
    console.warn('Supabase配置未正确设置，使用模拟客户端（支持访客模式）');
    
    supabaseInstance = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ 
          data: { user: null }, 
          error: { message: 'Supabase未配置，但您可以使用访客模式继续使用平台功能' }
        }),
        signUp: async () => ({ 
          data: { user: null }, 
          error: { message: 'Supabase未配置，但您可以使用访客模式继续使用平台功能' }
        }),
        onAuthStateChange: (callback) => {
          // 立即调用回调，传入未登录状态
          setTimeout(() => callback('SIGNED_OUT', null), 0);
          return { data: { subscription: { unsubscribe: () => {} } } };
        }
      },
      from: (table) => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase未配置，数据功能不可用' } }),
        update: () => Promise.resolve({ data: null, error: { message: 'Supabase未配置，数据功能不可用' } }),
        delete: () => Promise.resolve({ data: null, error: { message: 'Supabase未配置，数据功能不可用' } })
      })
    };
  }

  return supabaseInstance;
}

// 导出单例实例
const supabase = createSupabaseClient();

export default supabase;