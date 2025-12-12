// app/api/ai-assistant/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { streamClaude } from '@/lib/claudeStream';

// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const API_TIMEOUT = 30000;

/**
 * AI 助手 API 处理函数
 * 接收用户消息，调用Claude API，返回回复
 */
export async function POST(request) {
    try {
        // 检查API配置
        if (!CLAUDE_API_KEY) {
            return NextResponse.json(
                { 
                    error: 'API服务未配置', 
                    details: '请在.env.local文件中配置CLAUDE_API_KEY'
                },
                { status: 500 }
            );
        }

        const { message, modelType, userId } = await request.json();
        
        console.log(`处理AI助手请求，模型: ${modelType || 'general'}, 用户ID: ${userId || '匿名'}`);
        
        // 确保消息不为空
        if (!message) {
            return NextResponse.json(
                { error: '消息不能为空' },
                { status: 400 }
            );
        }

        // 根据模型类型构建系统提示词
        const getSystemPrompt = (type) => {
            switch (type) {
                case 'assessment':
                    return `您是EduAssess助手，专门帮助学生进行学习评估和能力测试。您能够：
1. 分析学生的学习表现和成绩
2. 提供个性化的学习建议
3. 解答关于测验和评估的问题
4. 帮助制定学习改进计划
请保持专业、鼓励和建设性的回复风格。`;

                case 'learningPath':
                    return `您是EduPath助手，专门帮助学生规划学习路径。您能够：
1. 根据学生目标制定学习计划
2. 推荐合适的学习资源和方法
3. 分析学习进度和调整计划
4. 解答关于学习路径的问题
请提供结构化、可操作的学习建议。`;

                case 'questionGenerator':
                    return `您是EduQuest助手，专门帮助生成和解答学习问题。您能够：
1. 根据知识点生成练习题目
2. 解答学生的学科问题
3. 提供题目解析和学习指导
4. 帮助理解复杂概念
请确保回答准确、清晰且富有教育价值。`;

                default:
                    return `您是EduSage，一个专业的教育AI助手。您能够：
1. 回答各种学科问题
2. 提供学习建议和指导
3. 帮助解决学习中的困难
4. 分享有效的学习方法
请保持友好、专业且富有启发性的回复风格。`;
            }
        };

        const systemPrompt = getSystemPrompt(modelType);

        try {
            const aiResponse = await streamClaude({
                apiUrl: CLAUDE_API_URL,
                apiKey: CLAUDE_API_KEY,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: typeof message === 'string' ? message : JSON.stringify(message) }
                ],
                model: 'claude-sonnet-4-20250514',
                maxTokens: 2000,
                temperature: 0.7,
                timeoutMs: API_TIMEOUT
            });

            console.log('Claude API响应成功');

            // 如果用户已登录，保存聊天记录
            if (userId) {
                try {
                    // 保存用户的问题到聊天历史
                    await supabase.from('ai_chat_history').insert({
                        user_id: userId,
                        role: 'user',
                        content: typeof message === 'string' ? message : JSON.stringify(message),
                        model: modelType || 'general',
                        created_at: new Date().toISOString()
                    });
                    
                    // 保存AI的回答到聊天历史
                    await supabase.from('ai_chat_history').insert({
                        user_id: userId,
                        role: 'assistant',
                        content: aiResponse,
                        model: modelType || 'general',
                        created_at: new Date().toISOString()
                    });
                    
                    console.log('聊天历史已保存到数据库');
                } catch (dbError) {
                    console.error('保存聊天历史时出错:', dbError);
                    // 即使保存失败，仍然返回AI响应
                }
            }

            return NextResponse.json({ 
                success: true,
                response: aiResponse,
                metadata: {
                    model: modelType || 'general',
                    timestamp: new Date().toISOString()
                }
            });

        } catch (apiError) {            
            if (apiError.name === 'AbortError' || /超时/.test(apiError.message || '')) {
                return NextResponse.json(
                    { error: 'AI助手服务响应超时，请稍后重试' },
                    { status: 408 }
                );
            }
            throw apiError;
        }

    } catch (error) {
        console.error('AI助手请求处理出错:', error);
        return NextResponse.json(
            { 
                error: `AI助手服务暂时不可用：${error.message}`,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}