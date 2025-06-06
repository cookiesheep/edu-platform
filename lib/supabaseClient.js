import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// Supabase客户端配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// 全局单例实例
let supabaseInstance = null;

// 检查环境变量是否存在
if (!supabaseUrl || !supabaseKey) {
  console.warn('缺失Supabase URL或密钥。使用模拟客户端。');
}

// 创建一个模拟客户端，在没有真实配置时使用
function createMockClient() {
  return {
    from: (table) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      signUp: () => Promise.resolve({ user: null, error: { message: '当前为演示模式' } }),
      signIn: () => Promise.resolve({ user: null, error: { message: '当前为演示模式' } }),
      signInWithPassword: () => Promise.resolve({ user: null, error: { message: '当前为演示模式' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: (callback) => {
        // 立即调用一次回调，传入空会话
        callback('SIGNED_OUT', null);
        return { 
          data: { subscription: null }, 
          unsubscribe: () => {} 
        };
      },
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
      }),
    },
  };
}

// 导出createClient函数
export const createClient = () => {
  // 如果已有实例，直接返回
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  // 如果没有配置环境变量，返回模拟客户端
  if (!supabaseUrl || !supabaseKey) {
    supabaseInstance = createMockClient();
    return supabaseInstance;
  }
  
  try {
    supabaseInstance = supabaseCreateClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return supabaseInstance;
  } catch (error) {
    console.error('创建Supabase客户端失败:', error);
    supabaseInstance = createMockClient();
    return supabaseInstance;
  }
};

// 创建并导出默认客户端实例
const supabase = createClient();
export default supabase;