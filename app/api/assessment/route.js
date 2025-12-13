export const runtime = 'nodejs'; // 确保使用 Node 运行时

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // 用于 Admin 写入
import { createServerClient } from '@supabase/ssr';   // 用于获取用户身份
import { cookies } from 'next/headers';
import { streamClaude } from '@/lib/claudeStream';

// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
const API_TIMEOUT = 30000;

/**
 * 成绩评估API处理函数
 * 接收答题数据，调用Claude API进行学习者评估
 */
export async function POST(req) {
    try {
        console.log('初始化评估流程...');

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
            console.warn('[Assessment] 获取用户身份失败:', e.message);
        }

        // B. 初始化 ADMIN 客户端 (用于写入数据库，绕过 RLS 权限问题)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
            console.error('[Assessment] SUPABASE_URL 缺失或格式异常:', supabaseUrl);
            return NextResponse.json(
                { error: '服务端未配置有效的 SUPABASE_URL' },
                { status: 500 }
            );
        }
        if (!serviceRoleKey) {
            console.error('[Assessment] Service Role Key 缺失');
            return NextResponse.json(
                { error: '服务端未配置 SUPABASE_SERVICE_ROLE_KEY' },
                { status: 500 }
            );
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

        // 检查API配置
        if (!CLAUDE_API_KEY) {
            return NextResponse.json(
                { error: 'API服务未配置', details: '请在.env.local文件中配置CLAUDE_API_KEY' },
                { status: 500 }
            );
        }

        // ==========================================
        // 2. 解析请求体
        // ==========================================
        const rawBody = await req.text();
        // console.log('assessment API接收到原始请求体:', rawBody.substring(0, 100) + '...');
        
        let requestData;
        try {
            requestData = JSON.parse(rawBody);
        } catch (parseError) {
            console.error('JSON解析失败:', parseError);
            return NextResponse.json({ error: `JSON解析失败: ${parseError.message}` }, { status: 400 });
        }

        const { 
            quiz_metadata, 
            grading_results, 
            detailed_data,
            user_id: frontendUserId,
            quiz_record_id // 可能由前端传来
        } = requestData;

        // 验证必要字段
        if (!quiz_metadata || !grading_results || !detailed_data) {
            return NextResponse.json({ error: '缺少必要的评估数据' }, { status: 400 });
        }

        // 确定最终的用户ID (优先使用 Auth Session，其次使用前端传来的)
        const finalUserId = sessionUserId || frontendUserId || quiz_metadata?.user_id || null;

        // ==========================================
        // 3. 构建 Prompt 与调用 AI (保持原逻辑)
        // ==========================================
        const systemPrompt = `您是"EduAnalyst"，一个专业的学习者评估系统。您的任务是根据学习者的答题数据，生成全面的学习者模型和评估报告，为个性化学习内容生成提供基础。

## 分析维度
### 正确率分析
- 总体正确率：${grading_results.percentage}%
- 答对题数：${grading_results.question_details?.filter(q => q.is_correct).length || 0}
- 总题数：${grading_results.question_details?.length || 0}

### 时间分析
- 总答题时间：${Math.floor((detailed_data.behavior_data?.totalDuration || 0) / 1000)}秒
- 平均答题时间：${Math.floor((detailed_data.metadata?.average_time_per_question || 0) / 1000)}秒/题
- 完成率：${Math.round((detailed_data.metadata?.completion_rate || 0) * 100)}%

### 行为分析
- 答案修改次数：${Object.values(detailed_data.modification_data || {}).reduce((a, b) => a + b, 0)}
- 答题顺序：${detailed_data.behavior_data?.questionOrder ? '非线性' : '线性'}

请按照以下结构生成评估报告：
# ${quiz_metadata.parameters?.subject || '学科'}学习者评估报告
## 📊 总体表现概览
{基于总体正确率和时间的简要总结}
### 🎯 核心指标
- 总体正确率: ${grading_results.percentage}%
- 平均答题时间: ${Math.floor((detailed_data.metadata?.average_time_per_question || 0) / 1000)}秒
- 完成度: ${Math.round((detailed_data.metadata?.completion_rate || 0) * 100)}%
- 整体评级: ${grading_results.grade_level}

## 🧠 认知能力评估
{基于答题表现评估认知水平}
### 认知特征
- 认知水平：{初级/中级/高级}
- 思维特点：{分析思维能力的特点}
- 认知优势：{表现突出的认知能力}
- 待提升领域：{需要改进的认知方面}

## 📚 知识掌握分析
{基于各知识点表现分析知识结构}
### 知识结构
- 知识水平：{基础/中等/深入}
- 已掌握知识点：{列出表现良好的知识点}
- 薄弱知识点：{列出需要加强的知识点}
- 知识缺口：{主要的知识空白领域}

## 🎨 学习风格推断
{基于答题行为推断学习偏好}
### 学习特征
- 主导学习风格：{视觉型/文本型/应用型/社交型}
- 信息处理偏好：{如何接收和处理信息}
- 学习节奏：{快速/稳定/深入思考型}

## 🔥 学习动机分析
{基于行为模式分析学习动机}
### 动机特征
- 主导动机类型：{任务导向/兴趣驱动/成就导向/应用导向}
- 激励因素：{最能激发学习的因素}
- 学习投入度：{对学习的专注程度}

## 🔍 错误模式分析
{分析错误答案的规律}
### 错误特点
- 主要错误类型：{系统性错误/概念混淆/计算错误/粗心错误}
- 概念混淆：{存在理解混淆的概念}
- 改进方向：{针对错误模式的改进建议}

## 💡 学习建议
{基于评估结果的个性化建议}
### 短期目标
{3-5个具体的短期学习目标}
### 学习策略
{针对学习风格和认知特点的学习方法建议}
### 资源推荐
{适合的学习资源和工具}

请确保分析有数据支撑，避免空泛描述。`;

        const assessmentContent = `请基于以下答题数据生成学习者评估报告：
## 基本信息
- 学科：${quiz_metadata.parameters?.subject || '未知'}
- 年级：${quiz_metadata.parameters?.grade_level || '未知'}
- 自评水平：${quiz_metadata.parameters?.self_assessed_level || '未知'}
- 学习目标：${quiz_metadata.parameters?.learning_goal || '未知'}

## 答题成绩
- 总分：${grading_results.total_score}/${grading_results.max_score}
- 正确率：${grading_results.percentage}%
- 等级评定：${grading_results.grade_level}

## 题目详情
${grading_results.question_details?.map((q, index) => 
    `题目${index + 1}：${q.is_correct ? '✓正确' : '✗错误'} | 学生答案：${q.student_answer} | 正确答案：${q.correct_answer} | 用时：${detailed_data.timing_data?.[index + 1] ? Math.floor(detailed_data.timing_data[index + 1] / 1000) + '秒' : '未知'} | 知识点：${q.knowledge_points?.join(', ') || '无'}`
).join('\n') || '无详细题目数据'}

## 行为数据
- 总答题时长：${Math.floor((detailed_data.behavior_data?.totalDuration || 0) / 1000)}秒
- 答案修改情况：${JSON.stringify(detailed_data.modification_data || {})}
- 答题顺序：${JSON.stringify(detailed_data.behavior_data?.questionOrder || [])}

## 反馈总结
优势：${grading_results.overall_feedback?.strengths?.join('; ') || '待分析'}
不足：${grading_results.overall_feedback?.weaknesses?.join('; ') || '待分析'}

请生成详细的个性化评估报告，为后续学习内容生成提供依据。`;

        try {
            const assessmentReport = await streamClaude({
                apiUrl: CLAUDE_API_URL,
                apiKey: CLAUDE_API_KEY,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: assessmentContent }
                ],
                model: 'claude-sonnet-4-20250514',
                maxTokens: 3000,
                temperature: 0.3,
                timeoutMs: API_TIMEOUT
            });
            console.log('Claude API 评估响应成功');

            // 生成结构化数据
            const structuredAssessment = {
                overall_performance: {
                    score: grading_results.percentage,
                    grade: grading_results.grade_level,
                    completion_rate: detailed_data.metadata?.completion_rate || 0,
                    total_time: detailed_data.behavior_data?.totalDuration || 0,
                    average_time_per_question: detailed_data.metadata?.average_time_per_question || 0
                },
                cognitive_assessment: {
                    level: grading_results.percentage >= 80 ? 'advanced' : grading_results.percentage >= 60 ? 'intermediate' : 'basic',
                    correct_count: grading_results.question_details?.filter(q => q.is_correct).length || 0,
                    total_count: grading_results.question_details?.length || 0
                },
                learning_patterns: {
                    modification_count: Object.values(detailed_data.modification_data || {}).reduce((a, b) => a + b, 0),
                    question_order: detailed_data.behavior_data?.questionOrder || [],
                    timing_pattern: detailed_data.timing_data || {}
                },
                knowledge_gaps: grading_results.question_details?.filter(q => !q.is_correct).map(q => ({
                    knowledge_points: q.knowledge_points || [],
                    error_type: q.explanation || ''
                })) || [],
                strengths: grading_results.overall_feedback?.strengths || [],
                weaknesses: grading_results.overall_feedback?.weaknesses || [],
                raw_report: assessmentReport
            };

            const responsePayload = {
                success: true,
                assessment: {
                    report: assessmentReport,
                    structured_data: structuredAssessment,
                    metadata: {
                        assessed_at: new Date().toISOString(),
                        quiz_metadata: quiz_metadata,
                        assessment_model: 'EduAnalyst-Claude',
                        data_completeness: {
                            has_timing_data: !!detailed_data.timing_data,
                            has_behavior_data: !!detailed_data.behavior_data,
                            has_modification_data: !!detailed_data.modification_data,
                            question_count: grading_results.question_details?.length || 0
                        }
                    }
                }
            };

            // ==========================================
            // ✅ 4. 写入数据库 (核心修复)
            // ==========================================
            if (finalUserId) {
                console.log(`[Assessment] 准备写入评估记录 (UserID: ${finalUserId})...`);

                // 4.1 自动查找关联的测验记录 (如果前端没传 quiz_record_id)
                let targetRelatedQuizId = quiz_record_id || null;
                if (!targetRelatedQuizId) {
                    try {
                        const { data: recentQuiz } = await supabaseAdmin
                            .from('quiz_records')
                            .select('id')
                            .eq('user_id', finalUserId)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .single();
                        
                        if (recentQuiz?.id) {
                            targetRelatedQuizId = recentQuiz.id;
                            // console.log('自动关联到最近测验:', targetRelatedQuizId);
                        }
                    } catch (err) {
                        // 查不到就算了，不影响评估生成
                    }
                }

                // 4.2 数据清洗：提取学习风格和中文认知水平
                // (这是把你原来 supabasePersistence 里的逻辑搬过来了)
                let finalLearningStyle = structuredAssessment.learning_patterns?.style || null;
                if (!finalLearningStyle && assessmentReport) {
                    const reportLower = assessmentReport.toLowerCase();
                    if (reportLower.includes('视觉')) finalLearningStyle = '视觉型';
                    else if (reportLower.includes('文本')) finalLearningStyle = '文本型';
                    else if (reportLower.includes('应用')) finalLearningStyle = '应用型';
                    else if (reportLower.includes('社交')) finalLearningStyle = '社交型';
                }

                let finalCognitiveLevel = structuredAssessment.cognitive_assessment?.level || null;
                if (finalCognitiveLevel === 'basic') finalCognitiveLevel = '初级认知';
                else if (finalCognitiveLevel === 'intermediate') finalCognitiveLevel = '中级认知';
                else if (finalCognitiveLevel === 'advanced') finalCognitiveLevel = '高级认知';

                // 4.3 执行写入
                try {
                    const { error: dbError } = await supabaseAdmin
                        .from('assessment_records')
                        .insert([
                            {
                                user_id: finalUserId,
                                related_quiz_id: targetRelatedQuizId,
                                cognitive_level: finalCognitiveLevel,
                                learning_style: finalLearningStyle,
                                knowledge_gaps: structuredAssessment.knowledge_gaps,
                                strengths: structuredAssessment.strengths,
                                suggestions: structuredAssessment.weaknesses,
                                full_report: assessmentReport
                            }
                        ]);

                    if (dbError) {
                        console.error('[Assessment] ❌ 写入失败:', dbError.message);
                    } else {
                        console.log('[Assessment] ✅ 评估记录已成功保存');
                    }
                } catch (dbErr) {
                    console.error('[Assessment] ❌ 数据库异常:', dbErr.message);
                }
            } else {
                console.warn('[Assessment] ⚠️ 未登录用户，跳过保存');
            }

            return NextResponse.json(responsePayload);

        } catch (apiError) {
            clearTimeout(timeoutId);
            if (apiError.name === 'AbortError') {
                return NextResponse.json({ error: 'AI评估服务响应超时，请稍后重试' }, { status: 408 });
            }
            throw apiError;
        }

    } catch (error) {
        console.error('成绩评估错误:', error);
        return NextResponse.json(
            { 
                error: `成绩评估失败：${error.message}`,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}