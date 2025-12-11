'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AssessmentReport from './AssessmentReport';
import { BarChart2, Search, Brain, RefreshCw, Sparkles, Download, CheckCircle, XCircle, AlertCircle, BookOpen } from 'lucide-react';

const QuizResults = ({ gradingResults, encouragement, onRetake, onNewQuiz, assessment }) => {
  const [currentTab, setCurrentTab] = useState('results');
  const [showAssessmentReport, setShowAssessmentReport] = useState(false);
  const router = useRouter();

  // 从评估结果提取参数并跳转到内容生成页面
  const handleGenerateContent = () => {
    if (!assessment) return;
    
    const { structured_data, metadata } = assessment;
    
    const cognitiveLevelMap = {
      'basic': '初级认知',
      'intermediate': '中级认知',
      'advanced': '高级认知'
    };
    const cognitiveLevel = cognitiveLevelMap[structured_data.cognitive_assessment?.level] || '中级认知';
    
    const score = structured_data.overall_performance?.score || 60;
    const priorKnowledge = score < 60 ? '基础' : score >= 80 ? '深入' : '中等';
    
    const modificationCount = structured_data.learning_patterns?.modification_count || 0;
    const learningStyle = modificationCount > 5 ? '文本型' : modificationCount > 2 ? '应用型' : '视觉型';
    
    const completionRate = structured_data.overall_performance?.completion_rate || 0;
    const motivationType = completionRate >= 0.9 ? '任务导向' : score >= 80 ? '成就导向' : '兴趣驱动';
    
    const subject = metadata?.quiz_metadata?.parameters?.subject || '通用';
    const knowledgeGaps = structured_data.knowledge_gaps || [];
    const knowledgePoint = knowledgeGaps.length > 0 
      ? knowledgeGaps[0].knowledge_points?.[0] || `${subject}核心概念`
      : `${subject}核心概念`;
    
    const prerequisiteConcepts = knowledgeGaps
      .flatMap(gap => gap.knowledge_points || [])
      .slice(0, 3)
      .join(', ') || '';
    
    const params = {
      cognitiveLevel,
      priorKnowledge,
      learningStyle,
      motivationType,
      knowledgePoint,
      subjectDomain: subject,
      prerequisiteConcepts,
      conceptType: '概念型',
      complexityLevel: score < 60 ? 2 : score >= 80 ? 4 : 3,
      learningObjective: score < 60 ? '理解' : score >= 80 ? '应用' : '理解'
    };
    
    sessionStorage.setItem('contentGeneratorParams', JSON.stringify(params));
    router.push('/content-generator');
  };

  if (!gradingResults || !encouragement) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center">
        <div className="text-slate-400 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500 mr-3"></div>
          加载成绩数据中...
        </div>
      </div>
    );
  }

  // 根据分数获取颜色主题
  const getScoreTheme = (percentage) => {
    if (percentage >= 90) return { color: '#10B981', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', textColor: 'text-emerald-400' };
    if (percentage >= 75) return { color: '#3B82F6', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20', textColor: 'text-blue-400' };
    if (percentage >= 60) return { color: '#F59E0B', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20', textColor: 'text-yellow-400' };
    return { color: '#EF4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', textColor: 'text-red-400' };
  };

  const scoreTheme = getScoreTheme(gradingResults.percentage);

  // 下载评估报告为PDF
  const downloadAssessmentReport = () => {
    if (!assessment) return;

    // 创建一个新窗口用于打印
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>学习者评估报告</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
            h1, h2, h3 { color: #333; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .score { font-size: 2em; font-weight: bold; color: ${scoreTheme.color}; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>学习者评估报告</h1>
            <p>评估时间: ${new Date(assessment.metadata.assessed_at).toLocaleString()}</p>
          </div>
          <div class="section">
            ${assessment.report.replace(/\n/g, '<br>')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <motion.div
      className="glass-panel rounded-2xl overflow-hidden border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标签导航 */}
      <div className="border-b border-white/10">
        <nav className="flex">
          <button
            onClick={() => setCurrentTab('results')}
            className={`px-6 py-4 text-sm font-medium transition-all flex items-center ${currentTab === 'results'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            成绩单
          </button>
          <button
            onClick={() => setCurrentTab('analysis')}
            className={`px-6 py-4 text-sm font-medium transition-all flex items-center ${currentTab === 'analysis'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
          >
            <Search className="w-4 h-4 mr-2" />
            详细分析
          </button>
          {assessment && (
            <button
              onClick={() => setCurrentTab('assessment')}
              className={`px-6 py-4 text-sm font-medium transition-all flex items-center ${currentTab === 'assessment'
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            >
              <Brain className="w-4 h-4 mr-2" />
              学习者评估
            </button>
          )}
        </nav>
      </div>

      {/* 标签内容 */}
      <div className="p-8">
        {currentTab === 'results' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* 成绩概览 */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-8">
                <div className="w-40 h-40 relative">
                  <CircularProgressbar
                    value={gradingResults.percentage}
                    text={`${gradingResults.percentage}%`}
                    styles={buildStyles({
                      textColor: '#fff',
                      pathColor: scoreTheme.color,
                      trailColor: 'rgba(255,255,255,0.1)',
                      textSize: '20px'
                    })}
                  />
                  <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] -z-10"></div>
                </div>
              </div>

              <div className={`inline-flex items-center px-6 py-3 rounded-xl ${scoreTheme.bgColor} border ${scoreTheme.borderColor} mb-6`}>
                <span className="text-3xl mr-4">{encouragement.emoji}</span>
                <div className="text-left">
                  <h2 className={`text-xl font-bold ${scoreTheme.textColor}`}>
                    {encouragement.title}
                  </h2>
                  <p className={`text-sm ${scoreTheme.textColor} opacity-80`}>
                    得分：{gradingResults.total_score}/{gradingResults.max_score}
                  </p>
                </div>
              </div>

              <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg">
                {encouragement.message}
              </p>
            </div>

            {/* 成绩统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors">
                <div className="text-3xl font-bold text-blue-400 mb-1">{gradingResults.percentage}%</div>
                <div className="text-sm text-blue-300/70">正确率</div>
              </div>
              <div className="text-center p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors">
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {gradingResults.question_details?.filter(q => q.is_correct).length || 0}
                </div>
                <div className="text-sm text-emerald-300/70">答对题数</div>
              </div>
              <div className="text-center p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl hover:bg-yellow-500/20 transition-colors">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {gradingResults.question_details?.filter(q => !q.is_correct).length || 0}
                </div>
                <div className="text-sm text-yellow-300/70">答错题数</div>
              </div>
              <div className="text-center p-5 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-colors">
                <div className="text-3xl font-bold text-purple-400 mb-1">{gradingResults.grade_level}</div>
                <div className="text-sm text-purple-300/70">等级评定</div>
              </div>
            </div>

            {/* 总体反馈 */}
            {gradingResults.overall_feedback && (
              <div className="space-y-4 mb-6">
                {gradingResults.overall_feedback.strengths?.length > 0 && (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <h4 className="font-bold text-emerald-400 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      优势表现
                    </h4>
                    <ul className="text-emerald-200/80 space-y-2">
                      {gradingResults.overall_feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {gradingResults.overall_feedback.weaknesses?.length > 0 && (
                  <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <h4 className="font-bold text-orange-400 mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      改进方向
                    </h4>
                    <ul className="text-orange-200/80 space-y-2">
                      {gradingResults.overall_feedback.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {gradingResults.overall_feedback.suggestions?.length > 0 && (
                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <h4 className="font-bold text-blue-400 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      学习建议
                    </h4>
                    <ul className="text-blue-200/80 space-y-2">
                      {gradingResults.overall_feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {currentTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
              <Search className="w-5 h-5 mr-2 text-cyan-400" />
              逐题详细分析
            </h3>
            <div className="space-y-6">
              {gradingResults.question_details?.map((question, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-l-4 bg-[#0f172a]/30 ${question.is_correct
                      ? 'border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]'
                      : 'border-red-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium flex items-center text-white text-lg">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-3 font-bold ${question.is_correct ? 'bg-emerald-500' : 'bg-red-500'
                        }`}>
                        {index + 1}
                      </span>
                      题目 {index + 1}
                    </h4>
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${question.is_correct
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                      {question.score}/{question.max_score}分
                    </div>
                  </div>

                  <div className="space-y-4 text-sm ml-11">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="font-bold text-slate-400 block mb-1">您的答案：</span>
                      <span className={`text-lg ${question.is_correct ? 'text-emerald-400' : 'text-red-400'}`}>
                        {question.student_answer || '未作答'}
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                      <span className="font-bold text-slate-400 block mb-1">正确答案：</span>
                      <span className="text-lg text-emerald-400">{question.correct_answer}</span>
                    </div>

                    {question.explanation && (
                      <div className="mt-4 p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                        <span className="font-bold text-blue-400 block mb-2 flex items-center">
                          <Search className="w-4 h-4 mr-1" /> 解析：
                        </span>
                        <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
                      </div>
                    )}

                    {question.knowledge_points?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs text-slate-500 py-1">知识点：</span>
                        {question.knowledge_points.map((point, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs rounded-md"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )) || (
                  <div className="text-center text-slate-500 py-12">
                    暂无详细分析数据
                  </div>
                )}
            </div>
          </motion.div>
        )}

        {currentTab === 'assessment' && assessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold mb-3 text-white">🧠 学习者评估报告</h3>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                基于您的答题数据，AI为您生成了专业的学习者模型和评估分析
              </p>

              {/* 评估概览卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {assessment.structured_data.cognitive_assessment.level === 'advanced' ? '高级' :
                      assessment.structured_data.cognitive_assessment.level === 'intermediate' ? '中级' : '初级'}
                  </div>
                  <div className="text-sm text-blue-300/70">认知水平</div>
                </div>
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">
                    {assessment.structured_data.overall_performance.score >= 80 ? '优秀' :
                      assessment.structured_data.overall_performance.score >= 60 ? '良好' : '需提升'}
                  </div>
                  <div className="text-sm text-emerald-300/70">总体表现</div>
                </div>
                <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {assessment.structured_data.learning_patterns.modification_count > 5 ? '深度思考型' :
                      assessment.structured_data.learning_patterns.modification_count > 2 ? '谨慎型' : '直觉型'}
                  </div>
                  <div className="text-sm text-purple-300/70">答题风格</div>
                </div>
                <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {assessment.structured_data.overall_performance.completion_rate >= 0.9 ? '高投入' :
                      assessment.structured_data.overall_performance.completion_rate >= 0.7 ? '中等投入' : '需激励'}
                  </div>
                  <div className="text-sm text-orange-300/70">学习投入</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setShowAssessmentReport(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  查看详细评估报告
                </button>
                <button
                  onClick={handleGenerateContent}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  生成个性化学习内容
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="border-t border-white/10 bg-[#0f172a]/50 px-8 py-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetake}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          重新答题
        </button>
        <button
          onClick={onNewQuiz}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          生成新试题
        </button>
        <button
          onClick={() => {
            if (!assessment) {
              alert('数据同步中，请稍后......');
              return;
            }
            handleGenerateContent();
          }}
          disabled={!assessment}
          className={`flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg shadow-cyan-500/20 ${
            !assessment ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          生成学习内容
        </button>
        <button
          onClick={() => {
            if (!assessment) {
              alert('数据同步中，请稍后......');
              return;
            }
            downloadAssessmentReport();
          }}
          disabled={!assessment}
          className={`flex-1 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg shadow-purple-500/20 ${
            !assessment ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Download className="w-4 h-4 mr-2" />
          下载评估报告
        </button>
      </div>

      {/* 评估报告弹窗 */}
      {showAssessmentReport && assessment && (
        <AssessmentReport
          assessment={assessment}
          onClose={() => setShowAssessmentReport(false)}
          onDownload={downloadAssessmentReport}
        />
      )}
    </motion.div>
  );
};

export default QuizResults;