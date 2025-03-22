// app/api/ai-assistant/route.js
import { NextResponse } from 'next/server';
import { callFastgptShareApi } from '@/lib/fastgptClient';
import { MODEL_IDS } from '@/lib/constants';
import { createClient } from '@/lib/supabaseClient';

/**
 * AI 助手 API 处理函数
 * 接收用户消息，调用对应的 FastGPT 模型，返回回复
 */
export async function POST(request) {
    try {
        const { message, modelType, userId } = await request.json();
        
        console.log(`处理AI助手请求，模型: ${modelType}, 用户ID: ${userId || '匿名'}`);
        
        // 确保消息不为空
        if (!message) {
            return NextResponse.json(
                { error: '消息不能为空' },
                { status: 400 }
            );
        }
        
        // 调用FastGPT API
        const response = await callFastgptShareApi(modelType, message);
        
        console.log('FastGPT API响应成功');
        
        // 如果用户已登录，保存聊天记录
        if (userId) {
            try {
                const supabase = createClient();
                
                // 保存用户的问题到聊天历史
                await supabase.from('ai_chat_history').insert({
                    user_id: userId,
                    role: 'user',
                    content: typeof message === 'string' ? message : JSON.stringify(message),
                    model: modelType,
                    created_at: new Date().toISOString()
                });
                
                // 保存AI的回答到聊天历史
                await supabase.from('ai_chat_history').insert({
                    user_id: userId,
                    role: 'assistant',
                    content: response,
                    model: modelType,
                    created_at: new Date().toISOString()
                });
                
                console.log('聊天历史已保存到数据库');
            } catch (dbError) {
                console.error('保存聊天历史时出错:', dbError);
                // 即使保存失败，仍然返回AI响应
            }
        }
        
        return NextResponse.json({ response });
    } catch (error) {
        console.error('AI助手请求处理出错:', error);
        return NextResponse.json(
            { error: `与AI模型通信时出错: ${error.message}` },
            { status: 500 }
        );
    }
}