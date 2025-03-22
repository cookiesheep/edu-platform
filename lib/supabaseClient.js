import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// Supabase客户端配置 - 修改为匹配您的环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// 检查环境变量是否存在
if (!supabaseUrl || !supabaseKey) {
  console.warn('缺失Supabase URL或密钥。请检查您的.env.local文件');
}

// 导出createClient函数
export const createClient = () => {
  // 如果没有配置环境变量，返回一个模拟客户端
  if (!supabaseUrl || !supabaseKey) {
    return createMockClient();
  }
  
  try {
    return supabaseCreateClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('创建Supabase客户端失败:', error);
    return createMockClient();
  }
};

// 创建一个模拟客户端，在没有真实配置时使用
function createMockClient() {
  return {
    from: (table) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    auth: {
      signUp: () => Promise.resolve({ user: null, error: null }),
      signIn: () => Promise.resolve({ user: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: null, unsubscribe: () => {} }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
      }),
    },
  };
}

// 创建客户端实例
const supabase = !supabaseUrl || !supabaseKey 
  ? createMockClient() 
  : supabaseCreateClient(supabaseUrl, supabaseKey);

export default supabase;