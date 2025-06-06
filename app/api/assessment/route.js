// app/api/assessment/route.js
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { callFastGptModel } from '@/lib/fastgptClient';

const ASSESSMENT_MODEL_ID = 'jo87glkagm0bjuu3a8a9fscf'; // 成绩评估模型

/**
 * 成绩评估API处理函数
 * 接收用户ID和学科信息，调用AI模型进行成绩评估
 */
export async function POST(req) {
    try {
        // 先读取原始请求体
        const rawBody = await req.text();
        console.log('assessment API接收到原始请求体:', rawBody);
        
        // 尝试解析JSON
        let requestData;
        try {
            requestData = JSON.parse(rawBody);
        } catch (parseError) {
            console.error('JSON解析失败:', parseError);
            console.error('原始请求体内容:', rawBody);
            return Response.json(
                { error: `JSON解析失败: ${parseError.message}` },
                { status: 400 }
            );
        }

        console.log('成功解析的请求数据:', requestData);

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

        // 构建EduAnalyst系统指令
        const systemPrompt = `您是"EduAnalyst"，一个专业的学习者评估系统。您的任务是根据学习者的答题数据，生成全面的学习者模型和评估报告，为个性化学习内容生成提供基础。

## 答题数据分析参数

### 正确率指标：
- 总体正确率：${grading_results.percentage}%
- 答对题数：${grading_results.question_details?.filter(q => q.is_correct).length || 0}
- 总题数：${grading_results.question_details?.length || 0}
- 知识点正确率：基于各题目涉及的知识点分析
- 难度梯度正确率：不同难度级别题目的正确百分比
- 认知层次正确率：不同认知层次题目的正确百分比

### 时间指标：
- 总答题时间：${Math.floor((detailed_data.behavior_data?.totalDuration || 0) / 1000)}秒
- 平均答题时间：${Math.floor((detailed_data.metadata?.average_time_per_question || 0) / 1000)}秒/题
- 各题答题时间：${JSON.stringify(detailed_data.timing_data || {})}
- 完成率：${Math.round((detailed_data.metadata?.completion_rate || 0) * 100)}%

### 答题行为指标：
- 修改次数：${JSON.stringify(detailed_data.modification_data || {})}
- 答题顺序：${JSON.stringify(detailed_data.behavior_data?.questionOrder || [])}
- 开始时间：${detailed_data.behavior_data?.completionTime || ''}

### 错误模式分析：
- 错误题目详情：${JSON.stringify(grading_results.question_details?.filter(q => !q.is_correct) || [])}
- 系统性错误模式需要基于错误类型进行分析

## 学习者模型构建参数

### 认知维度评估：
基于答题表现和时间数据，评估学习者的认知水平：
- 初级认知：需要具体操作和直观表征，难以理解抽象概念
- 中级认知：能处理有限抽象概念，但需要具体例子支持
- 高级认知：精通抽象思维，可理解复杂系统和元认知概念

### 先验知识评估：
- 基础：缺乏该领域基础概念和术语
- 中等：理解基本概念，但对复杂关联和细微差别了解有限
- 深入：已掌握该领域大部分概念和关系，需要填补特定知识缺口

### 学习风格推断：
基于题型表现和答题行为推断：
- 视觉型：从图表和视觉题目的表现推断
- 文本型：从文字描述题目的表现推断
- 应用型：从实践和应用题目的表现推断

### 学习动机分析：
- 任务导向：完成任务的效率和专注度
- 兴趣驱动：在感兴趣题目上的表现差异
- 成就导向：难题挑战的接受度和坚持度
- 应用导向：实用性题目的参与度和表现

您必须严格按照下文的"输出结构规范"生成评估报告，确保每个部分都有数据支持和清晰的分析。`;

        // 构建详细的评估请求
        const assessmentContent = `请基于以下详细的答题数据生成学习者评估报告：

## 基本信息
- 学科：${quiz_metadata.parameters?.subject || '未知'}
- 年级：${quiz_metadata.parameters?.grade_level || '未知'}
- 自评水平：${quiz_metadata.parameters?.self_assessed_level || '未知'}
- 学习目标：${quiz_metadata.parameters?.learning_goal || '未知'}

## 答题成果数据
- 总分：${grading_results.total_score}/${grading_results.max_score}
- 正确率：${grading_results.percentage}%
- 等级评定：${grading_results.grade_level}

## 详细答题分析
${grading_results.question_details?.map((q, index) => 
    `题目${index + 1}：${q.is_correct ? '正确' : '错误'} | 学生答案：${q.student_answer} | 正确答案：${q.correct_answer} | 知识点：${q.knowledge_points?.join(', ')}`
).join('\n') || '无详细题目数据'}

## 时间和行为数据
- 总答题时长：${Math.floor((detailed_data.behavior_data?.totalDuration || 0) / 1000)}秒
- 平均每题时间：${Math.floor((detailed_data.metadata?.average_time_per_question || 0) / 1000)}秒
- 各题用时：${JSON.stringify(detailed_data.timing_data)}
- 答案修改情况：${JSON.stringify(detailed_data.modification_data)}
- 答题顺序：${JSON.stringify(detailed_data.behavior_data?.questionOrder)}

## 优势与不足
优势：${grading_results.overall_feedback?.strengths?.join('; ') || '待分析'}
不足：${grading_results.overall_feedback?.weaknesses?.join('; ') || '待分析'}

请按照以下结构生成完整的评估报告：

## ${quiz_metadata.parameters?.subject || '学科'}学习者评估报告

### 📊 总体表现概览
{基于总体正确率和时间的简要总结，包含一个总体评分}

#### 🎯 评估要点
- 总体正确率: ${grading_results.percentage}%
- 平均答题时间: ${Math.floor((detailed_data.metadata?.average_time_per_question || 0) / 1000)}秒
- 完成度: ${Math.round((detailed_data.metadata?.completion_rate || 0) * 100)}%
- 整体评级: ${grading_results.grade_level}

### 🧠 认知维度分析
{基于不同认知层次题目表现的分析，确定学习者的认知水平}

#### 🔍 认知特征
- 认知水平评估: {初级认知/中级认知/高级认知}
- 优势认知层次: {如记忆、理解等}
- 需提升认知层次: {如分析、评估等}
- 认知特点: {2-3个关键特点描述}

### 📚 知识掌握分析
{基于不同知识点和难度级别题目表现的分析，评估先验知识水平}

#### 🧩 知识特征
- 知识水平评估: {基础/中等/深入}
- 已掌握知识点: {列出3-5个表现良好的知识点}
- 薄弱知识点: {列出3-5个需要加强的知识点}
- 知识结构特点: {知识结构的2-3个特点描述}

### 🔑 先验知识评估
{基于先验知识相关题目表现的详细分析}

#### 🧩 先验知识缺口
- 需加强的先验知识: {列出3-5个需要加强的先验知识点}
- 先验知识影响: {分析先验知识缺口如何影响当前学习}
- 先验知识建议: {针对先验知识缺口的具体学习建议}

### 🎨 学习风格分析
{基于不同类型题目表现和答题行为的分析，推断学习风格}

#### 🔄 学习行为模式
- 主导学习风格: {视觉型/文本型/应用型/社交型}
- 次要学习风格: {如适用}
- 学习行为特点: {2-3个关键行为特点}
- 信息处理偏好: {偏好的信息获取和处理方式}

### 🔥 学习动机分析
{基于答题行为、时间分配和挑战接受度的分析，评估学习动机类型}

#### 🚀 动机特征
- 主导动机类型: {任务导向/兴趣驱动/成就导向/应用导向}
- 激励因素: {最能激发学习者的2-3个因素}
- 阻碍因素: {可能降低学习者动力的2-3个因素}
- 投入度特点: {学习投入的特点描述}

### 🔍 错误模式分析
{基于错误答案的模式分析，识别系统性问题和概念混淆}

#### 🔎 错误模式洞察
- 主要错误类型: {系统性错误/概念混淆/计算错误/注意力错误}
- 概念混淆点: {存在混淆的关键概念}
- 系统性误解: {系统性的知识误解或思维定式}

### 💡 学习建议与路径
{基于上述分析，提供针对性的学习建议和下一步学习路径}

#### 📝 短期学习目标
{3-5个具体、可实现的短期学习目标}

#### 🛣 推荐学习路径
{基于学习者模型的个性化学习路径建议}

#### 📚 学习资源推荐
{根据学习风格和动机类型推荐的3-5个学习资源}

#### 🔧 学习策略建议
{根据认知水平和学习风格推荐的3-5个学习策略}

### 📋 学习者模型总结
{对学习者模型的简明总结，可直接用于个性化内容生成}

#### 🧠 认知维度: {初级认知/中级认知/高级认知}
{简要说明和证据支持}

#### 📚 先验知识: {基础/中等/深入}
{简要说明和证据支持}

#### 🎨 学习风格: {视觉型/文本型/应用型/社交型}
{简要说明和证据支持}

#### 🔥 学习动机: {任务导向/兴趣驱动/成就导向/应用导向}
{简要说明和证据支持}

请确保每个部分都基于提供的数据进行分析，给出具体的证据支持，避免空泛的描述。`;

        // 调用Claude API进行评估
        const response = await fetch('https://globalai.vip/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-0PS8ZmxbBPvbROWtIiaaNyx0FfUqwbGsljsyY2sFXZS8lNvi'
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
                max_tokens: 4000,
                temperature: 0.3 // 降低温度以提高分析的一致性
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Claude API 评估错误:', errorData);
            throw new Error(`Claude API 调用失败: ${response.status}`);
        }

        const data = await response.json();
        console.log('Claude API 评估响应成功');

        // 提取评估结果
        const assessmentReport = data.choices?.[0]?.message?.content;
        
        if (!assessmentReport) {
            throw new Error('AI评估响应格式无效');
        }

        // 分析评估报告并提取结构化数据
        const extractStructuredData = (report) => {
            const structuredData = {
                overall_performance: {
                    score: grading_results.percentage,
                    grade: grading_results.grade_level,
                    completion_rate: detailed_data.metadata?.completion_rate || 0,
                    total_time: detailed_data.behavior_data?.totalDuration || 0
                },
                cognitive_assessment: {
                    level: 'middle', // 默认值，将从报告中解析
                    strengths: [],
                    needs_improvement: []
                },
                knowledge_assessment: {
                    level: 'basic', // 默认值，将从报告中解析
                    mastered_points: [],
                    weak_points: []
                },
                learning_style: {
                    primary: 'text', // 默认值，将从报告中解析
                    characteristics: []
                },
                motivation_analysis: {
                    primary_type: 'task_oriented', // 默认值，将从报告中解析
                    motivating_factors: [],
                    hindering_factors: []
                },
                error_patterns: {
                    primary_type: 'conceptual_confusion',
                    systematic_issues: []
                },
                recommendations: {
                    short_term_goals: [],
                    learning_path: '',
                    resources: [],
                    strategies: []
                },
                raw_report: report
            };

            // 这里可以添加更复杂的文本解析逻辑来提取结构化数据
            // 简单示例：
            if (report.includes('高级认知')) structuredData.cognitive_assessment.level = 'advanced';
            else if (report.includes('中级认知')) structuredData.cognitive_assessment.level = 'intermediate';
            else structuredData.cognitive_assessment.level = 'basic';

            return structuredData;
        };

        const structuredAssessment = extractStructuredData(assessmentReport);

        // 返回评估结果
        return Response.json({
            success: true,
            assessment: {
                report: assessmentReport,
                structured_data: structuredAssessment,
                metadata: {
                    assessed_at: new Date().toISOString(),
                    quiz_metadata: quiz_metadata,
                    assessment_model: 'EduAnalyst',
                    data_completeness: {
                        has_timing_data: !!detailed_data.timing_data,
                        has_behavior_data: !!detailed_data.behavior_data,
                        has_modification_data: !!detailed_data.modification_data,
                        question_count: grading_results.question_details?.length || 0
                    }
                }
            }
        });

    } catch (error) {
        console.error('成绩评估错误:', error);
        return Response.json(
            { 
                error: error.message || '成绩评估失败，请稍后重试',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}