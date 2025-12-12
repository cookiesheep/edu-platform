export const runtime = 'nodejs'; // 避免 Edge 下 fetch 失败

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // 用于 Admin 写入
import { createServerClient } from '@supabase/ssr';   // 用于获取用户身份
import { cookies } from 'next/headers';
import { matchLearningResources } from '@/lib/learningResources';
import { streamClaude } from '@/lib/claudeStream';

// 环境变量配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const TEXT_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const API_TIMEOUT = 120000; // 2分钟超时

// 备用服务列表
const BACKUP_API_SERVICES = [
    'https://api.deepseek.com/v1/chat/completions',
    'https://api.moonshot.cn/v1/chat/completions',
    'https://api.openai.com/v1/chat/completions'
];

/**
 * 🛠️ 通用文本 AI 调用函数
 */
async function callTextAI(systemPrompt, userPrompt, maxTokens = 6000) {
    for (const apiUrl of [TEXT_API_URL, ...BACKUP_API_SERVICES]) {
        try {
            const isAnthropic = apiUrl.includes('anthropic.com');
            const isOAI = apiUrl.includes('openai') || apiUrl.includes('chat/completions');

            if (isAnthropic) {
                return await streamClaude({
                    apiUrl,
                    apiKey: CLAUDE_API_KEY,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    maxTokens,
                    temperature: 0.7,
                    timeoutMs: API_TIMEOUT
                });
            }

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

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CLAUDE_API_KEY}`
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            return isOAI ? (data.choices?.[0]?.message?.content || '') : (data.content?.[0]?.text || '');
            
        } catch (e) {
            console.warn(`Text AI Attempt failed: ${apiUrl}`, e.message);
            continue;
        }
    }
    throw new Error("所有文本生成服务均调用失败");
}

/**
 * 🚀 主处理函数
 */
export async function POST(request) {
    try {
        if (!CLAUDE_API_KEY) {
            return NextResponse.json({ error: 'API Key Missing' }, { status: 500 });
        }

        // ==========================================
        // 1. 初始化 Supabase 客户端
        // ==========================================
        
        // A. 初始化 SSR 客户端 (用于安全地获取当前登录用户)
        let sessionUserId = null;
        try {
            const cookieStore = await cookies();
            const authClient = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                {
                    cookies: {
                        getAll() { return cookieStore.getAll() },
                        setAll() {} // 只读
                    }
                }
            );
            const { data: { user } } = await authClient.auth.getUser();
            sessionUserId = user?.id || null;
        } catch (e) {
            console.warn('[ContentGen] 获取用户Session失败:', e.message);
        }

        // B. 初始化 ADMIN 客户端 (用于写入数据库，绕过 RLS 权限问题)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
            console.error('[ContentGen] SUPABASE_URL 缺失或格式异常:', supabaseUrl);
            return NextResponse.json({ error: '缺少有效的 SUPABASE_URL' }, { status: 500 });
        }
        if (!serviceRoleKey) {
            console.error('[ContentGen] Service Role Key 缺失');
            return NextResponse.json({ error: '缺少 SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
        }

        const supabaseAdmin = createClient(
            supabaseUrl,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // ==========================================
        // 2. 解析请求
        // ==========================================
        const body = await request.json();
        const { learner_profile, knowledge_point, content_parameters, userId: frontendUserId } = body;

        // 双重保险：优先使用服务端验证的ID，其次使用前端传来的ID
        const finalUserId = sessionUserId || frontendUserId;

        if (!learner_profile || !knowledge_point) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 3. 构建 Prompt (纯文本、详细、无特殊符号)
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
3. 使用**中文序号**（如“一、”、“1.”）来表示章节层级。
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
        
        // 4. 生成内容
        const generatedContent = await callTextAI(systemPrompt, userPrompt);

        // 5. 匹配资源
        const matchedResources = matchLearningResources(knowledge_point.topic, learner_profile.cognitive_level);

        // 防止超大内容导致写入超时 / fetch failed：截断存储内容，但响应仍返回完整文本
        const MAX_CONTENT_CHARS = 40000; // 约 40KB 字符
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

        // ==========================================
        // ✅ 6. 写入数据库 (核心修复 + 限制 payload 大小)
        // ==========================================
        if (finalUserId) {
            console.log(`[ContentGen] 正在保存学习内容 (UserID: ${finalUserId})...`);
            
            const insertPayload = {
                user_id: finalUserId,
                topic: knowledge_point.topic,
                content: storedContent, // 存库用截断内容
                params: {
                    learner_profile: learner_profile,
                    content_parameters: content_parameters,
                    complexity: complexity
                }
            };

            const payloadSize = Buffer.byteLength(JSON.stringify(insertPayload), 'utf8');
            if (payloadSize > 900_000) {
                console.warn('[ContentGen] 插入 payload 过大，截断后仍超限，size:', payloadSize);
            }

            const { error: dbError } = await supabaseAdmin
                .from('learning_materials')
                .insert([ insertPayload ]);

            if (dbError) {
                console.error('[ContentGen] ❌ 保存失败:', dbError.message, dbError);
            } else {
                console.log('[ContentGen] ✅ 学习内容已成功保存到数据库');
            }
        } else {
            console.warn('[ContentGen] ⚠️ 未检测到登录用户，内容未保存');
        }

        return NextResponse.json({ success: true, learning_content: structuredContent });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ 
            error: error.message || '内容生成服务暂时不可用',
            details: error.stack 
        }, { status: 500 });
    }
}