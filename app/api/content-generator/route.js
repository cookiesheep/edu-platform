export const runtime = 'edge'; // ✅ 启用 Edge Runtime 以支持长连接

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { matchLearningResources } from '@/lib/learningResources';
import { streamClaudeGenerator } from '@/lib/claudeStream';

// 环境变量配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const TEXT_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';

// 备用服务列表
const BACKUP_API_SERVICES = [
    'https://api.deepseek.com/v1/chat/completions',
    'https://api.moonshot.cn/v1/chat/completions',
    'https://api.openai.com/v1/chat/completions'
];

export async function POST(req) {
  const encoder = new TextEncoder();
  
  // 创建流式响应
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // 1. 解析请求体
        const body = await req.json();
        const { learner_profile, knowledge_point, content_parameters, userId: frontendUserId } = body;

        if (!learner_profile || !knowledge_point) {
          send({ status: 'error', error: 'Missing parameters' });
          controller.close();
          return;
        }

        // 2. 获取用户 ID (尝试从 Cookie 获取，失败则用前端传来的)
        let sessionUserId = null;
        try {
          const cookieStore = await cookies();
          // 注意：在 Edge Runtime 中使用 createServerClient 需要适配
          // 这里简化处理，仅用于获取 ID，不做复杂操作
          const authClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
              cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() {} 
              }
            }
          );
          const { data: { user } } = await authClient.auth.getUser();
          sessionUserId = user?.id;
        } catch (e) {
          console.warn('[ContentGen] 获取 Session 失败:', e);
        }
        const finalUserId = sessionUserId || frontendUserId;

        // 3. 构建 Prompt
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

        send({ status: 'init', message: '正在初始化生成环境...' });

        // 4. 调用 AI 生成 (带重试机制)
        let fullContent = '';
        let success = false;
        const apiUrls = [TEXT_API_URL, ...BACKUP_API_SERVICES];

        for (const apiUrl of apiUrls) {
          try {
            send({ status: 'generating', message: '正在生成学习内容...' });
            
            const generator = streamClaudeGenerator({
              apiUrl,
              apiKey: CLAUDE_API_KEY,
              system: systemPrompt,
              messages: [{ role: 'user', content: userPrompt }],
              maxTokens: 6000,
              temperature: 0.7,
              timeoutMs: 120000 // 2分钟超时
            });

            for await (const chunk of generator) {
              fullContent += chunk;
              // 可选：发送增量更新，如果前端需要打字机效果
              // send({ status: 'generating', delta: chunk }); 
            }

            if (fullContent.length > 100) {
              success = true;
              break; // 成功
            }
          } catch (e) {
            console.warn(`API ${apiUrl} failed:`, e);
            continue; // 尝试下一个
          }
        }

        if (!success) {
          send({ status: 'error', error: '所有线路均繁忙，请稍后再试' });
          controller.close();
          return;
        }

        // 5. 后处理与保存
        send({ status: 'matching', message: '正在匹配学习资源...' });
        
        // 尝试提取 JSON (虽然 Prompt 要求纯文本，但为了兼容性保留逻辑)
        let structuredContent = { content: fullContent };
        try {
            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.content) structuredContent = parsed;
            }
        } catch (e) {}

        // 匹配资源
        const matchedResources = matchLearningResources(knowledge_point.topic, learner_profile.cognitive_level);
        structuredContent.learning_resources = matchedResources;
        structuredContent.learner_adaptations = { ...learner_profile };

        // 6. 保存到数据库
        if (finalUserId) {
          send({ status: 'saving', message: '正在保存到数据库...' });
          try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            
            if (supabaseUrl && serviceRoleKey) {
              const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
                auth: { autoRefreshToken: false, persistSession: false }
              });

              const MAX_CONTENT_CHARS = 40000;
              const storedContent = fullContent.slice(0, MAX_CONTENT_CHARS);

              await supabaseAdmin.from('learning_materials').insert({
                user_id: finalUserId,
                topic: knowledge_point.topic,
                content: storedContent,
                params: {
                  learner_profile,
                  content_parameters,
                  complexity
                }
              });
              console.log('[ContentGen] Saved to DB');
            }
          } catch (dbError) {
            console.error('[ContentGen] DB Save Error:', dbError);
            // 数据库错误不影响返回结果
          }
        }

        send({ status: 'complete', success: true, learning_content: structuredContent });
        controller.close();

      } catch (err) {
        console.error('Stream Error:', err);
        send({ status: 'error', error: err.message || 'Internal Server Error' });
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
