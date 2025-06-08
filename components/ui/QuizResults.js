'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AssessmentReport from './AssessmentReport';

const QuizResults = ({ gradingResults, encouragement, onRetake, onNewQuiz, assessment }) => {
  const [currentTab, setCurrentTab] = useState('results');
  const [showAssessmentReport, setShowAssessmentReport] = useState(false);

  if (!gradingResults || !encouragement) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="text-gray-500">加载成绩数据中...</div>
      </div>
    );
  }

  // 根据分数获取颜色主题
  const getScoreTheme = (percentage) => {
    if (percentage >= 90) return { color: '#10B981', bgColor: '#ECFDF5', textColor: 'text-green-600' };
    if (percentage >= 75) return { color: '#3B82F6', bgColor: '#EFF6FF', textColor: 'text-blue-600' };
    if (percentage >= 60) return { color: '#F59E0B', bgColor: '#FFFBEB', textColor: 'text-yellow-600' };
    return { color: '#EF4444', bgColor: '#FEF2F2', textColor: 'text-red-600' };
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
      className="bg-white rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标签导航 */}
      <div className="border-b">
        <nav className="flex">
          <button
            onClick={() => setCurrentTab('results')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              currentTab === 'results'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 成绩单
          </button>
          <button
            onClick={() => setCurrentTab('analysis')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              currentTab === 'analysis'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔍 详细分析
          </button>
          {assessment && (
            <button
              onClick={() => setCurrentTab('assessment')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                currentTab === 'assessment'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🧠 学习者评估
            </button>
          )}
        </nav>
      </div>

      {/* 标签内容 */}
      <div className="p-6">
        {currentTab === 'results' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* 成绩概览 */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={gradingResults.percentage}
                    text={`${gradingResults.percentage}%`}
                    styles={buildStyles({
                      textColor: scoreTheme.color,
                      pathColor: scoreTheme.color,
                      trailColor: '#E5E7EB'
                    })}
                  />
                </div>
              </div>
              
              <div className={`inline-flex items-center px-6 py-3 rounded-lg ${encouragement.bgColor} mb-4`}>
                <span className="text-2xl mr-3">{encouragement.emoji}</span>
                <div className="text-left">
                  <h2 className={`text-xl font-bold ${encouragement.color}`}>
                    {encouragement.title}
                  </h2>
                  <p className={`text-sm ${encouragement.color}`}>
                    得分：{gradingResults.total_score}/{gradingResults.max_score}
                  </p>
                </div>
              </div>

              <p className={`text-gray-700 max-w-2xl mx-auto leading-relaxed`}>
                {encouragement.message}
              </p>
            </div>

            {/* 成绩统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{gradingResults.percentage}%</div>
                <div className="text-sm text-blue-500">正确率</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {gradingResults.question_details?.filter(q => q.is_correct).length || 0}
                </div>
                <div className="text-sm text-green-500">答对题数</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {gradingResults.question_details?.filter(q => !q.is_correct).length || 0}
                </div>
                <div className="text-sm text-yellow-500">答错题数</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{gradingResults.grade_level}</div>
                <div className="text-sm text-purple-500">等级评定</div>
              </div>
            </div>

            {/* 总体反馈 */}
            {gradingResults.overall_feedback && (
              <div className="space-y-4 mb-6">
                {gradingResults.overall_feedback.strengths?.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-bold text-green-700 mb-2">✅ 优势表现</h4>
                    <ul className="text-green-600 space-y-1">
                      {gradingResults.overall_feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {gradingResults.overall_feedback.weaknesses?.length > 0 && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-bold text-orange-700 mb-2">🎯 改进方向</h4>
                    <ul className="text-orange-600 space-y-1">
                      {gradingResults.overall_feedback.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {gradingResults.overall_feedback.suggestions?.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-bold text-blue-700 mb-2">💡 学习建议</h4>
                    <ul className="text-blue-600 space-y-1">
                      {gradingResults.overall_feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
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
            <h3 className="text-xl font-bold mb-4">📝 逐题详细分析</h3>
            <div className="space-y-4">
              {gradingResults.question_details?.map((question, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-l-4 ${
                    question.is_correct 
                      ? 'bg-green-50 border-green-400' 
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-2 ${
                        question.is_correct ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {index + 1}
                      </span>
                      题目 {index + 1}
                    </h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      question.is_correct 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {question.score}/{question.max_score}分
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">您的答案：</span>
                      <span className={question.is_correct ? 'text-green-700' : 'text-red-700'}>
                        {question.student_answer || '未作答'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">正确答案：</span>
                      <span className="text-green-700">{question.correct_answer}</span>
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <span className="font-medium text-gray-700">解析：</span>
                        <p className="text-gray-600 mt-1">{question.explanation}</p>
                      </div>
                    )}
                    
                    {question.knowledge_points?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-gray-500">知识点：</span>
                        {question.knowledge_points.map((point, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-8">
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
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">🧠 学习者评估报告</h3>
              <p className="text-gray-600 mb-4">
                基于您的答题数据，AI为您生成了专业的学习者模型和评估分析
              </p>
              
              {/* 评估概览卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {assessment.structured_data.cognitive_assessment.level === 'advanced' ? '高级' :
                     assessment.structured_data.cognitive_assessment.level === 'intermediate' ? '中级' : '初级'}
                  </div>
                  <div className="text-sm text-blue-500">认知水平</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {assessment.structured_data.overall_performance.score >= 80 ? '优秀' :
                     assessment.structured_data.overall_performance.score >= 60 ? '良好' : '需提升'}
                  </div>
                  <div className="text-sm text-green-500">总体表现</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {assessment.structured_data.learning_patterns.modification_count > 5 ? '深度思考型' :
                     assessment.structured_data.learning_patterns.modification_count > 2 ? '谨慎型' : '直觉型'}
                  </div>
                  <div className="text-sm text-purple-500">答题风格</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {assessment.structured_data.overall_performance.completion_rate >= 0.9 ? '高投入' :
                     assessment.structured_data.overall_performance.completion_rate >= 0.7 ? '中等投入' : '需激励'}
                  </div>
                  <div className="text-sm text-orange-500">学习投入</div>
                </div>
              </div>

              <button
                onClick={() => setShowAssessmentReport(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                📋 查看详细评估报告
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="border-t bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetake}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors"
        >
          🔄 重新答题
        </button>
        <button
          onClick={onNewQuiz}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition-colors"
        >
          ✨ 生成新试题
        </button>
        {assessment && (
          <button
            onClick={downloadAssessmentReport}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            📄 下载评估报告
          </button>
        )}
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