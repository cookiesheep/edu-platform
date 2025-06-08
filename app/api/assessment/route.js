// app/api/assessment/route.js
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || 'https://globalai.vip/v1/chat/completions';
const API_TIMEOUT = 30000;

/**
 * 成绩评估API处理函数
 * 接收答题数据，调用Claude API进行学习者评估
 */
export async function POST(req) {
    try {
        console.log('初始化Supabase客户端...');

        // 检查API配置
        if (!CLAUDE_API_KEY) {
            return Response.json(
                { 
                    error: 'API服务未配置', 
                    details: '请在.env.local文件中配置CLAUDE_API_KEY'
                },
                { status: 500 }
            );
        }

        // 先读取原始请求体
        const rawBody = await req.text();
        console.log('assessment API接收到原始请求体:', rawBody.substring(0, 200) + '...');
        
        // 尝试解析JSON
        let requestData;
        try {
            requestData = JSON.parse(rawBody);
        } catch (parseError) {
            console.error('JSON解析失败:', parseError);
            return Response.json(
                { error: `JSON解析失败: ${parseError.message}` },
                { status: 400 }
            );
        }

        console.log('成功解析的请求数据:', {
            has_quiz_metadata: !!requestData.quiz_metadata,
            has_grading_results: !!requestData.grading_results,
            has_detailed_data: !!requestData.detailed_data,
            user_id: requestData.user_id || 'none'
        });

        const { 
            quiz_metadata, 
            grading_results, 
            detailed_data,
            user_id 
        } = requestData;

        // 验证必要字段
        if (!quiz_metadata || !grading_results || !detailed_data) {
            return Response.json(
                { error: '缺少必要的评估数据' },
                { status: 400 }
            );
        }

        // 构建系统提示词
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

        // 构建详细的评估请求
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

        // 调用Claude API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        try {
            const response = await fetch(CLAUDE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CLAUDE_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: assessmentContent
                        }
                    ],
                    max_tokens: 3000, // 减少token以加快响应
                    temperature: 0.3
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Claude API错误 (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log('Claude API 评估响应成功');

            // 提取评估结果
            const assessmentReport = data.content?.[0]?.text || data.choices?.[0]?.message?.content;
            
            if (!assessmentReport) {
                throw new Error('AI评估响应格式无效');
            }

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

            // 返回评估结果
            return Response.json({
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
            });

        } catch (apiError) {
            clearTimeout(timeoutId);
            
            if (apiError.name === 'AbortError') {
                return Response.json(
                    { error: 'AI评估服务响应超时，请稍后重试' },
                    { status: 408 }
                );
            }
            
            throw apiError;
        }

    } catch (error) {
        console.error('成绩评估错误:', error);
        return Response.json(
            { 
                error: `成绩评估失败：${error.message}`,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}