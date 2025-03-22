import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// Supabase客户端配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 确保这些变量存在，否则显示错误提示
if (!supabaseUrl || !supabaseKey) {
    console.error('缺失Supabase URL或密钥。请检查您的.env.local文件');
}

// 导出createClient函数
export const createClient = () => {
  return supabaseCreateClient(supabaseUrl, supabaseKey);
};

// 也可以直接导出一个实例
const supabase = supabaseCreateClient(supabaseUrl, supabaseKey);
export default supabase;