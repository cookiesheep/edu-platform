import { createClient } from '@supabase/supabase-js';

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'your-anon-key';

// 单例模式，防止多个客户端实例
let supabase = null;

// 检查是否是真实的Supabase配置
const isRealSupabase = supabaseUrl !== 'https://your-project.supabase.co' && 
                      supabaseKey !== 'your-anon-key' &&
                      supabaseUrl.includes('supabase.co');

if (isRealSupabase) {
  // 使用真实的Supabase客户端
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} else {
  // 使用模拟客户端，避免在没有真实配置时产生错误
  console.warn('Supabase配置未正确设置，使用模拟客户端');
  
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ 
        data: { user: null }, 
        error: { message: 'Supabase未配置，无法登录' }
      }),
      signUp: async () => ({ 
        data: { user: null }, 
        error: { message: 'Supabase未配置，无法注册' }
      }),
      onAuthStateChange: (callback) => {
        // 立即调用回调，传入未登录状态
        callback('SIGNED_OUT', null);
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: (table) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Supabase未配置' } }),
      update: () => ({ data: null, error: { message: 'Supabase未配置' } }),
      delete: () => ({ data: null, error: { message: 'Supabase未配置' } })
    })
  };
}

export default supabase;