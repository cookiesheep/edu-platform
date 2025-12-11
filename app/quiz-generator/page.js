'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import QuizGeneratorForm from '@/components/ui/QuizGeneratorForm';
import GeneratedQuiz from '@/components/ui/GeneratedQuiz';
import { Sparkles, Brain, Zap, Target, BarChart2, CheckCircle, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SpotlightCard from '@/components/ui/SpotlightCard';
import ParallaxFloating from '@/components/ui/ParallaxFloating';

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
    <MainLayout>
      <div className="min-h-screen bg-transparent pt-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-[#020617] pointer-events-none" />

        <ParallaxFloating speed={-0.2} className="absolute top-20 left-10 z-0">
          <div className="w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        </ParallaxFloating>

        <ParallaxFloating speed={0.4} className="absolute top-40 right-10 z-0">
          <div className="w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </ParallaxFloating>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* 页面标题 */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full glass-panel mb-6 border border-cyan-500/30">
                <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                <span className="text-cyan-100 text-sm font-medium tracking-wide">AI 驱动</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                智能试题 <span className="text-gradient-primary">生成器</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                基于 AI 的个性化试题生成系统，支持智能批改、学习者评估和个性化学习建议。
                让每一次练习都更有价值。
              </p>
            </div>
          </ScrollReveal>

          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-8 mx-auto max-w-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <strong className="font-bold mr-2">错误:</strong>
                    <span className="block sm:inline">{error}</span>
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
                  className="glass-panel rounded-2xl overflow-hidden border border-white/10"
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
            <ScrollReveal delay={0.3} className="mt-24 max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                  系统特色功能
                </h2>
                <p className="text-slate-400">
                  全方位的智能辅助，提升学习效率
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <Target className="w-8 h-8 text-cyan-400" />,
                    title: "智能生成",
                    description: "基于学科、年级和学习目标生成个性化试题"
                  },
                  {
                    icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
                    title: "AI 智能批改",
                    description: "支持客观题和主观题的自动批改与详细反馈"
                  },
                  {
                    icon: <Brain className="w-8 h-8 text-purple-400" />,
                    title: "学习者评估",
                    description: "分析认知水平、学习风格和动机模式"
                  },
                  {
                    icon: <BarChart2 className="w-8 h-8 text-pink-400" />,
                    title: "数据分析",
                    description: "收集答题时间、行为数据进行深度分析"
                  }
                ].map((feature, index) => (
                  <SpotlightCard
                    key={feature.title}
                    className="glass-panel p-8 rounded-2xl border border-white/5 h-full"
                  >
                    <div className="mb-6 p-4 bg-slate-900/50 rounded-xl inline-block border border-white/5">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </SpotlightCard>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* 系统流程说明 */}
          {!generatedContent && !isGenerating && (
            <ScrollReveal delay={0.6} className="mt-24 max-w-4xl mx-auto text-center pb-12">
              <h2 className="text-3xl font-bold text-white mb-12">
                使用流程
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
                {[
                  { step: "1", text: "填写需求", icon: "📝" },
                  { step: "2", text: "AI 生成", icon: "🤖" },
                  { step: "3", text: "在线答题", icon: "✍️" },
                  { step: "4", text: "智能批改", icon: "🔍" },
                  { step: "5", text: "评估分析", icon: "📊" }
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className="relative flex flex-col items-center group"
                  >
                    <div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center text-2xl mb-4 border border-white/10 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300">
                      {item.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {item.step}
                    </div>
                    <div className="text-sm text-slate-300 font-medium">{item.text}</div>

                    {index < 4 && (
                      <div className="hidden md:block absolute top-8 left-full w-12 h-[2px] bg-gradient-to-r from-white/10 to-transparent mx-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default QuizGeneratorPage;