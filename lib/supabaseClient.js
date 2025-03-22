import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端实例，使用环境变量中的URL和匿名密钥
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// 确保这些变量存在，否则显示错误提示
if (!supabaseUrl || !supabaseKey) {
    console.error('缺失Supabase URL或密钥。请检查您的.env.local文件');
}

// 创建并导出Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;