// 流式响应版本 - 避免 Vercel 超时
export const runtime = 'nodejs';
export const maxDuration = 60;

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { matchLearningResources } from '@/lib/learningResources';
import { streamClaude } from '@/lib/claudeStream';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const TEXT_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const API_TIMEOUT = 120000;

/**
 * 调用 AI 生成内容（保持原有逻辑）
 */
async function callTextAI(systemPrompt, userPrompt, maxTokens = 6000) {
    const isAnthropic = TEXT_API_URL.includes('anthropic.com');
    const isOAI = TEXT_API_URL.includes('openai') || TEXT_API_URL.includes('chat/completions');

    if (isAnthropic || TEXT_API_URL.includes('chat/completions')) {
        // 使用 streamClaude（已经支持两种格式）
        return await streamClaude({
            apiUrl: TEXT_API_URL,
            apiKey: CLAUDE_API_KEY,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userPrompt }
            ],
            maxTokens,
            temperature: 0.7,
            timeoutMs: API_TIMEOUT
        });
    }

    // 备用逻辑
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const body = {
        model: 'claude-sonnet-4-20250514',
        messages: isOAI
            ? [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
            : [
                { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
            ],
        max_tokens: maxTokens,
        temperature: 0.7
    };

    const res = await fetch(TEXT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(isOAI 
                ? { 'Authorization': `Bearer ${CLAUDE_API_KEY}` }
                : { 'x-api-key': CLAUDE_API_KEY, 'anthropic-version': '2023-06-01' }
            )
        },
        body: JSON.stringify(body),
        signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    return isOAI ? (data.choices?.[0]?.message?.content || '') : (data.content?.[0]?.text || '');
}

/**
 * 流式响应 POST 处理器
 */
export async function POST(request) {
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
        async start(controller) {
            const sendData = (data) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                if (!CLAUDE_API_KEY) {
                    sendData({ error: 'API Key Missing' });
                    controller.close();
                    return;
                }

                sendData({ status: 'init', message: '正在初始化...' });

                // 1. 获取用户身份
                let sessionUserId = null;
                try {
                    const cookieStore = await cookies();
                    const authClient = createServerClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                        {
                            cookies: {
                                getAll() { return cookieStore.getAll(); },
                                setAll() {}
                            }
                        }
                    );
                    const { data: { user } } = await authClient.auth.getUser();
                    sessionUserId = user?.id || null;
                } catch (e) {
                    console.warn('[ContentGen] 获取用户失败:', e.message);
                }

                // 2. 初始化 Admin 客户端
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
                
                if (!supabaseUrl || !serviceRoleKey) {
                    sendData({ error: '缺少 Supabase 配置' });
                    controller.close();
                    return;
                }

                const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
                    auth: { autoRefreshToken: false, persistSession: false }
                });

                // 3. 解析请求
                const body = await request.json();
                const { learner_profile, knowledge_point, content_parameters, userId: frontendUserId } = body;
                const finalUserId = sessionUserId || frontendUserId;

                if (!learner_profile || !knowledge_point) {
                    sendData({ error: 'Missing parameters' });
                    controller.close();
                    return;
                }

                sendData({ status: 'preparing', message: '正在准备生成内容...' });

                // 4. 构建 Prompt
                const complexity = knowledge_point.complexity || 3;
                const isElementary = complexity <= 2;
                const isAdvanced = complexity >= 4;
                
                const languageStyle = isElementary 
                    ? '使用生动形象的语言，多用比喻和故事，避免专业术语，适合小学生理解'
                    : isAdvanced
                    ? '使用专业术语和严谨的表达，适合大学生和专业人士'
                    : '使用通俗易懂但准确的语言，适合中学生理解';

                const systemPrompt = `您是EduSage，一个专业的自适应教育内容生成系统。

## 学习者画像
- 认知水平：${learner_profile.cognitive_level || '中等'}
- 先验知识：${learner_profile.prior_knowledge?.join(', ') || '基础'}
- 学习风格：${learner_profile.learning_style || '视觉型'}

## 生成要求
请生成**极度详细、逻辑清晰**的学习内容。

**严格排版规则：**
1. **禁止使用 Markdown 的 # (标题) 和 * (加粗/列表) 符号**。
2. 使用**空行**来分隔不同的段落。
3. 使用**中文序号**（如"一、"、"1."）来表示章节层级。
4. 重点概念可以用【】包裹。
5. 代码示例请使用 \`\`\`语言 ... \`\`\` 包裹。

**内容结构：**
一、 知识概览
二、 概念解析
三、 原理机制
四、 实际应用
五、 学习案例
六、 互动练习
七、 知识拓展
八、 总结回顾

**语言风格：** ${languageStyle}`;

                const userPrompt = `请为"${knowledge_point.topic}"生成详细的学习内容。`;

                // 5. 生成内容
                sendData({ status: 'generating', message: '正在调用 AI 生成内容，请稍候...' });
                const generatedContent = await callTextAI(systemPrompt, userPrompt);

                // 6. 匹配资源
                sendData({ status: 'matching', message: '正在匹配学习资源...' });
                const matchedResources = matchLearningResources(knowledge_point.topic, learner_profile.cognitive_level);

                // 7. 构建结构化内容
                const MAX_CONTENT_CHARS = 40000;
                const storedContent = generatedContent?.slice(0, MAX_CONTENT_CHARS) || '';

                const structuredContent = {
                    topic: knowledge_point.topic,
                    content: generatedContent,
                    knowledge_image: null,
                    learning_resources: matchedResources,
                    learner_adaptations: { ...learner_profile },
                    content_metadata: { 
                        language_complexity: content_parameters?.language_complexity,
                        estimated_reading_time: Math.ceil(generatedContent.length / 300) 
                    }
                };

                // 8. 保存到数据库
                if (finalUserId) {
                    sendData({ status: 'saving', message: '正在保存到数据库...' });
                    
                    const { error: dbError } = await supabaseAdmin
                        .from('learning_materials')
                        .insert([{
                            user_id: finalUserId,
                            topic: knowledge_point.topic,
                            content: storedContent,
                            params: {
                                learner_profile,
                                content_parameters,
                                complexity
                            }
                        }]);

                    if (dbError) {
                        console.error('[ContentGen] 保存失败:', dbError);
                        sendData({ status: 'warning', message: '内容生成成功，但保存失败' });
                    } else {
                        console.log('[ContentGen] ✅ 学习内容已成功保存到数据库');
                    }
                }

                // 9. 发送最终结果
                sendData({ 
                    status: 'complete',
                    success: true, 
                    learning_content: structuredContent 
                });
                
                controller.close();

            } catch (error) {
                console.error('[ContentGen] 错误:', error);
                sendData({
                    status: 'error',
                    error: error.message || '内容生成失败'
                });
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
