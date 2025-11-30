import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

// 从环境变量获取API配置 - 支持OpenAI兼容格式
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const API_TIMEOUT = 60000; // 增加到60秒

// 备用API服务列表
const BACKUP_API_SERVICES = [
    'https://api.deepseek.com/v1/chat/completions',
    'https://api.moonshot.cn/v1/chat/completions',
    'https://api.openai.com/v1/chat/completions'
];

// 检测API服务类型
const isOpenAIFormat = CLAUDE_API_URL.includes('chat/completions') || CLAUDE_API_URL.includes('openai') || CLAUDE_API_URL.includes('globalai') || CLAUDE_API_URL.includes('deepseek') || CLAUDE_API_URL.includes('moonshot');

/**
 * 智能内容生成API处理函数
 * 接收学习者特征和知识点，调用Claude API生成个性化学习内容
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

        // 解析请求体
        const body = await request.json();
        const { 
            learner_profile, 
            knowledge_point,
            content_parameters,
            userId 
        } = body;

        // 参数验证
        if (!learner_profile || !knowledge_point) {
            return NextResponse.json(
                { error: '缺少必要参数：learner_profile或knowledge_point' },
                { status: 400 }
            );
        }

        // 如果提供了userId，验证用户登录状态
        if (userId) {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session || session.user.id !== userId) {
                return NextResponse.json(
                    { error: '未授权访问' },
                    { status: 401 }
                );
            }
        }

        // 构建系统提示词
        const systemPrompt = `您是EduSage，一个专业的自适应教育内容生成系统。您的任务是根据学习者的个性化特征和目标知识点，生成最适合的学习内容。

## 学习者画像分析
- 认知水平：${learner_profile.cognitive_level || '中等'}
- 先验知识：${learner_profile.prior_knowledge?.join(', ') || '基础'}
- 学习风格：${learner_profile.learning_style || '视觉型'}
- 动机类型：${learner_profile.motivation_type || '任务导向'}
- 注意力特征：${learner_profile.attention_span || '正常'}

## 知识点信息
- 主题：${knowledge_point.topic}
- 类型：${knowledge_point.type || '概念性知识'}
- 复杂度：${knowledge_point.complexity || '中等'}
- 先决条件：${knowledge_point.prerequisites?.join(', ') || '无'}

## 内容生成参数
- 语言复杂度：${content_parameters?.language_complexity || '适中'}
- 内容密度：${content_parameters?.content_density || '中等'}
- 互动性：${content_parameters?.interactivity || '中等'}
- 实例比例：${content_parameters?.example_ratio || '30%'}

## 生成要求
请基于以上信息生成个性化学习内容，包含8个核心模块：

### 📚 学习指南结构
1. **知识概览** - 知识点的整体介绍和重要性
2. **概念解析** - 核心概念的详细说明和定义
3. **原理机制** - 底层原理和运作机制
4. **实际应用** - 现实世界中的应用场景
5. **学习案例** - 具体例子和问题解决
6. **互动练习** - 适合学习者的练习活动
7. **知识拓展** - 相关知识点和深入方向
8. **总结回顾** - 要点总结和记忆要点

请确保内容风格和难度完全匹配学习者特征。`;

        const userPrompt = `请为"${knowledge_point.topic}"生成个性化学习内容。

学习者特征：
- 认知水平：${learner_profile.cognitive_level}
- 学习风格：${learner_profile.learning_style}
- 动机类型：${learner_profile.motivation_type}

内容要求：
- 语言复杂度：${content_parameters?.language_complexity}
- 内容密度：${content_parameters?.content_density}
- 互动性水平：${content_parameters?.interactivity}

请生成完整的8模块学习指南，确保内容深度和表达方式完全适合这位学习者。`;

        // 准备API请求 - 添加重试机制和备用服务
        const MAX_RETRIES = 2;
        let lastError = null;
        const apiServices = [CLAUDE_API_URL, ...BACKUP_API_SERVICES];
        
        for (let serviceIndex = 0; serviceIndex < apiServices.length; serviceIndex++) {
            const currentApiUrl = apiServices[serviceIndex];
            const currentIsOpenAIFormat = currentApiUrl.includes('chat/completions') || currentApiUrl.includes('openai') || currentApiUrl.includes('globalai') || currentApiUrl.includes('deepseek') || currentApiUrl.includes('moonshot');
            
            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

            let requestBody;
            let headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CLAUDE_API_KEY}`
            };

                if (currentIsOpenAIFormat) {
                    // OpenAI格式请求体
                    requestBody = {
                        model: 'claude-sonnet-4-20250514',
                        messages: [
                            {
                                role: 'system',
                                content: systemPrompt
                            },
                            {
                                role: 'user',
                                content: userPrompt
                            }
                        ],
                        max_tokens: 4000,
                        temperature: 0.7
                    };
                } else {
                    // Claude格式请求体
                    headers['anthropic-version'] = '2023-06-01';
                    requestBody = {
                        model: 'claude-sonnet-4-20250514',
                        messages: [
                            {
                                role: 'user',
                                content: `${systemPrompt}\n\n${userPrompt}`
                            }
                        ],
                        max_tokens: 4000,
                        temperature: 0.7
                    };
                }

                try {
                    console.log(`尝试API服务: ${currentApiUrl} (第${attempt + 1}次尝试)`);
                    const response = await fetch(currentApiUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Claude API错误 (${response.status}): ${errorText}`);
                }

                const data = await response.json();

                // 提取生成的内容 - 兼容不同API格式
                let generatedContent;
                if (data.choices && data.choices[0]) {
                    // OpenAI格式响应
                    generatedContent = data.choices[0].message?.content;
                } else if (data.content && data.content[0]) {
                    // Claude格式响应
                    generatedContent = data.content[0].text;
                } else {
                    throw new Error('AI响应格式无效');
                }

                if (!generatedContent) {
                    throw new Error('AI响应内容为空');
                }

                // 构建结构化响应
                const structuredContent = {
                    topic: knowledge_point.topic,
                    content: generatedContent,
                    learner_adaptations: {
                        cognitive_level: learner_profile.cognitive_level,
                        learning_style: learner_profile.learning_style,
                        motivation_type: learner_profile.motivation_type
                    },
                    content_metadata: {
                        language_complexity: content_parameters?.language_complexity,
                        content_density: content_parameters?.content_density,
                        interactivity: content_parameters?.interactivity,
                        estimated_reading_time: Math.ceil(generatedContent.length / 200) // 估算阅读时间（分钟）
                    }
                };

                return NextResponse.json({ 
                    success: true,
                    learning_content: structuredContent,
                    metadata: {
                        generated_at: new Date().toISOString(),
                        model: 'EduSage',
                        knowledge_point: knowledge_point.topic,
                        attempt: attempt + 1,
                        api_service: currentApiUrl,
                        service_index: serviceIndex
                    }
                });

            } catch (apiError) {
                clearTimeout(timeoutId);
                lastError = apiError;
                
                // 如果是最后一次尝试，尝试下一个服务或抛出错误
                if (attempt === MAX_RETRIES) {
                    if (serviceIndex === apiServices.length - 1) {
                        // 所有服务都尝试过了
                        if (apiError.name === 'AbortError') {
                            return NextResponse.json(
                                { 
                                    error: 'AI服务响应超时，请稍后重试',
                                    suggestion: '建议检查网络连接或稍后再试',
                                    retryable: true,
                                    timeout: API_TIMEOUT,
                                    attempts: MAX_RETRIES + 1,
                                    services_tried: apiServices.length
                                },
                                { status: 408 }
                            );
                        }
                        throw apiError;
                    } else {
                        // 尝试下一个服务
                        console.log(`服务 ${currentApiUrl} 失败，尝试下一个服务...`);
                        break;
                    }
                }
                
                // 等待后重试
                console.log(`API调用失败，第${attempt + 1}次重试...`, apiError.message);
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        }
        }

    } catch (error) {
        console.error('智能内容生成API错误:', error);
        return NextResponse.json(
            { 
                error: `内容生成失败：${error.message}`,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
} 