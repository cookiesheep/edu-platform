'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizGeneratorForm from '@/components/ui/QuizGeneratorForm';
import GeneratedQuiz from '@/components/ui/GeneratedQuiz';

const QuizGeneratorPage = () => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // 处理试题生成
  const handleQuizGeneration = async (formData) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      console.log('开始生成试题...', formData);
      
      const response = await fetch('/api/quiz-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('API响应:', data);

      if (!response.ok) {
        throw new Error(data.error || '生成试题失败');
      }

      if (data.success && (data.quiz_data || data.quiz_content)) {
        // 处理新的数据结构：如果API直接返回字段，构建quiz_data对象
        const quizData = data.quiz_data || {
          quiz_content: data.quiz_content,
          answers_content: data.answers_content,
          full_content: data.full_content,
          metadata: data.metadata
        };
        
        setQuizData(quizData);
        setGeneratedContent(quizData.quiz_content || quizData.full_content);
        console.log('试题生成成功');
      } else {
        throw new Error('生成的内容格式不正确');
      }
    } catch (err) {
      console.error('生成试题时出错:', err);
      setError(err.message || '生成试题失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 处理重新答题
  const handleRetake = () => {
    console.log('重新答题');
    // 保持当前的试题内容，只重置答题状态
  };

  // 处理生成新试题
  const handleNewQuiz = () => {
    console.log('生成新试题');
    setGeneratedContent(null);
    setQuizData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🧠 智能试题生成器
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            基于AI的个性化试题生成系统，支持智能批改、学习者评估和个性化学习建议
          </p>
        </motion.div>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 mx-auto max-w-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <strong className="font-bold">错误:</strong>
                  <span className="block sm:inline ml-1">{error}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 主要内容区域 */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!generatedContent ? (
              // 试题生成表单
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <QuizGeneratorForm 
                  onGenerate={handleQuizGeneration} 
                  loading={isGenerating}
                />
              </motion.div>
            ) : (
              // 试题显示和答题界面
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <GeneratedQuiz
                  content={generatedContent}
                  quizData={quizData}
                  onRetake={handleRetake}
                  onNewQuiz={handleNewQuiz}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 功能特色说明 */}
        {!generatedContent && !isGenerating && (
          <motion.div
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              🚀 系统特色功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🎯",
                  title: "智能试题生成",
                  description: "基于学科、年级和学习目标生成个性化试题"
                },
                {
                  icon: "🤖",
                  title: "AI智能批改",
                  description: "支持客观题和主观题的自动批改与详细反馈"
                },
                {
                  icon: "🧠",
                  title: "学习者评估",
                  description: "分析认知水平、学习风格和动机模式"
                },
                {
                  icon: "📊",
                  title: "数据分析",
                  description: "收集答题时间、行为数据进行深度分析"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-3xl mb-3 text-center">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 系统流程说明 */}
        {!generatedContent && !isGenerating && (
          <motion.div
            className="mt-16 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              📋 使用流程
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              {[
                { step: "1", text: "填写学习需求", icon: "📝" },
                { step: "2", text: "AI生成试题", icon: "🤖" },
                { step: "3", text: "在线答题", icon: "✍️" },
                { step: "4", text: "智能批改", icon: "🔍" },
                { step: "5", text: "评估分析", icon: "📊" }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                    {item.step}
                  </div>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-sm text-gray-600 font-medium">{item.text}</div>
                  {index < 4 && (
                    <div className="hidden md:block absolute ml-20 w-8 h-0.5 bg-gray-300"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizGeneratorPage; 