'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestSupabase() {
  const [config, setConfig] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取配置信息
    setConfig({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      supabaseInstance: !!supabase,
    });
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 测试 Supabase 连接...');
      
      // 测试 1: 获取会话
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('📊 会话测试:', { sessionData, sessionError });
      
      // 测试 2: 尝试注册一个测试账号（不会真的注册，只是测试 API）
      const testEmail = `test-${Date.now()}@example.com`;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'Test123456!',
      });
      
      console.log('📊 注册测试:', { signUpData, signUpError });
      
      setTestResult({
        success: !signUpError,
        sessionError: sessionError?.message,
        signUpError: signUpError?.message,
        message: signUpError ? `错误: ${signUpError.message}` : '✅ 连接成功！',
      });
    } catch (error) {
      console.error('❌ 测试失败:', error);
      setTestResult({
        success: false,
        error: error.message,
        message: `❌ 测试失败: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Supabase 连接测试</h1>
        
        {/* 配置信息 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 环境配置</h2>
          {config && (
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="text-gray-400">NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className="text-cyan-400 ml-2">{config.url || '❌ 未设置'}</span>
              </div>
              <div>
                <span className="text-gray-400">ANON_KEY:</span>
                <span className="text-cyan-400 ml-2">
                  {config.hasAnonKey ? `✅ ${config.anonKeyPrefix}` : '❌ 未设置'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Supabase 客户端:</span>
                <span className="text-cyan-400 ml-2">
                  {config.supabaseInstance ? '✅ 已初始化' : '❌ 未初始化'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 测试按钮 */}
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? '测试中...' : '🚀 测试连接'}
        </button>

        {/* 测试结果 */}
        {testResult && (
          <div className={`rounded-lg p-6 ${testResult.success ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="text-gray-400">状态:</span>
                <span className="ml-2">{testResult.message}</span>
              </div>
              {testResult.sessionError && (
                <div>
                  <span className="text-gray-400">会话错误:</span>
                  <span className="text-red-400 ml-2">{testResult.sessionError}</span>
                </div>
              )}
              {testResult.signUpError && (
                <div>
                  <span className="text-gray-400">注册错误:</span>
                  <span className="text-red-400 ml-2">{testResult.signUpError}</span>
                </div>
              )}
              {testResult.error && (
                <div>
                  <span className="text-gray-400">详细错误:</span>
                  <span className="text-red-400 ml-2">{testResult.error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 说明 */}
        <div className="mt-8 bg-blue-900/30 border border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">💡 使用说明</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>检查环境变量是否正确设置</li>
            <li>点击"测试连接"按钮验证 Supabase 配置</li>
            <li>打开浏览器开发者工具（F12）查看 Network 标签</li>
            <li>应该看到请求发送到 <code className="bg-gray-700 px-1">/supabase/auth/v1/...</code></li>
          </ul>
        </div>

        {/* 返回链接 */}
        <div className="mt-6">
          <a href="/" className="text-cyan-400 hover:text-cyan-300">← 返回首页</a>
        </div>
      </div>
    </div>
  );
}
