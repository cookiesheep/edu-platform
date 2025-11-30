'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FileText, Brain, Sparkles, Send, AlertCircle, CheckCircle, Loader, BookOpen, Target, Lightbulb } from 'lucide-react';

export default function ContentGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);
  const [isBackupContent, setIsBackupContent] = useState(false);

  // 表单状态
  const [cognitiveLevel, setCognitiveLevel] = useState('中级认知');
  const [priorKnowledge, setPriorKnowledge] = useState('中等');
  const [learningStyle, setLearningStyle] = useState('视觉型');
  const [motivationType, setMotivationType] = useState('兴趣驱动');
  const [knowledgePoint, setKnowledgePoint] = useState('');
  const [subjectDomain, setSubjectDomain] = useState('');
  const [conceptType, setConceptType] = useState('概念型');
  const [complexityLevel, setComplexityLevel] = useState(3);
  const [prerequisiteConcepts, setPrerequisiteConcepts] = useState('');
  const [learningObjective, setLearningObjective] = useState('理解');

  const handleGenerateContent = async (e) => {
    e.preventDefault();

    if (!knowledgePoint.trim()) {
      alert('请填写知识点');
      return;
    }

    if (!subjectDomain.trim()) {
      alert('请填写学科领域');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setIsBackupContent(false);

      // 按照API期望的结构组织数据
      const requestData = {
        learner_profile: {
          cognitive_level: cognitiveLevel,
          prior_knowledge: [priorKnowledge],
          learning_style: learningStyle,
          motivation_type: motivationType,
          attention_span: '正常'
        },
        knowledge_point: {
          topic: knowledgePoint,
          type: conceptType,
          complexity: complexityLevel,
          prerequisites: prerequisiteConcepts ? prerequisiteConcepts.split(',').map(item => item.trim()) : []
        },
        content_parameters: {
          language_complexity: '适中',
          content_density: '中等',
          interactivity: '中等',
          example_ratio: '30%'
        },
        userId: null // 如果有用户登录，可以从上下文获取
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 统一为60秒

      try {
        const response = await fetch('/api/content-generator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '内容生成失败');
        }

        const data = await response.json();

        // 检查返回的数据结构
        if (data.success && data.learning_content) {
          setGeneratedContent(data.learning_content.content);
        } else if (data.content) {
          setGeneratedContent(data.content);
        } else {
          throw new Error('返回数据格式异常');
        }

        if (data.isBackup) {
          setIsBackupContent(true);
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('请求超时，请检查网络连接后重试');
        }
        throw fetchError;
      }
    } catch (err) {
      console.error('内容生成出错:', err);
      setError(err.message || '生成内容时发生错误');
    } finally {
      setIsGenerating(false);
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "智能分析",
      description: "基于学习者特征智能分析最适合的内容结构"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "精准匹配",
      description: "根据认知水平和学习目标精准定制内容"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "个性化生成",
      description: "考虑学习风格和动机类型，生成个性化学习材料"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#020617] pt-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

        {/* 页面头部 */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#020617] to-[#020617] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* 页面标题 */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mr-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    智能学习 <span className="text-gradient-primary">内容生成</span>
                  </h1>
                  <p className="text-lg text-slate-400">
                    基于 AI 的个性化学习内容生成系统
                  </p>
                </div>
              </div>

              <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                根据学习者特征和知识点要求，智能生成精准适配的个性化教学内容，
                让每个学习者都能获得最适合自己的学习体验
              </p>
            </motion.div>

            {/* 特色功能介绍 */}
            <motion.div
              className="grid md:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {features.map((feature, index) => (
                <div key={index} className="glass-panel rounded-xl p-6 text-center border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* 左侧表单 */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="glass-panel rounded-2xl border border-white/10 p-6 sticky top-24">
                  <div className="flex items-center mb-6">
                    <Sparkles className="w-5 h-5 text-cyan-400 mr-3" />
                    <h2 className="text-xl font-bold text-white">内容生成参数</h2>
                  </div>

                  <form onSubmit={handleGenerateContent} className="space-y-6">

                    {/* 基本信息 */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        知识点信息
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          知识点 <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={knowledgePoint}
                          onChange={(e) => setKnowledgePoint(e.target.value)}
                          placeholder="请输入具体知识点，如「二次方程求解」"
                          className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          学科领域 <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={subjectDomain}
                          onChange={(e) => setSubjectDomain(e.target.value)}
                          placeholder="请输入学科领域，如「高中数学」"
                          className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          先决知识
                        </label>
                        <input
                          type="text"
                          value={prerequisiteConcepts}
                          onChange={(e) => setPrerequisiteConcepts(e.target.value)}
                          placeholder="如「一次方程、代数运算」"
                          className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* 学习者模型 */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        学习者特征
                      </h3>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">认知水平</label>
                          <select
                            value={cognitiveLevel}
                            onChange={(e) => setCognitiveLevel(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          >
                            <option value="初级认知" className="bg-[#0f172a]">初级认知</option>
                            <option value="中级认知" className="bg-[#0f172a]">中级认知</option>
                            <option value="高级认知" className="bg-[#0f172a]">高级认知</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">先验知识</label>
                          <select
                            value={priorKnowledge}
                            onChange={(e) => setPriorKnowledge(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          >
                            <option value="基础" className="bg-[#0f172a]">基础</option>
                            <option value="中等" className="bg-[#0f172a]">中等</option>
                            <option value="深入" className="bg-[#0f172a]">深入</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">学习风格</label>
                          <select
                            value={learningStyle}
                            onChange={(e) => setLearningStyle(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          >
                            <option value="视觉型" className="bg-[#0f172a]">视觉型</option>
                            <option value="文本型" className="bg-[#0f172a]">文本型</option>
                            <option value="应用型" className="bg-[#0f172a]">应用型</option>
                            <option value="社交型" className="bg-[#0f172a]">社交型</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">学习目标</label>
                          <select
                            value={learningObjective}
                            onChange={(e) => setLearningObjective(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                          >
                            <option value="记忆" className="bg-[#0f172a]">记忆</option>
                            <option value="理解" className="bg-[#0f172a]">理解</option>
                            <option value="应用" className="bg-[#0f172a]">应用</option>
                            <option value="分析" className="bg-[#0f172a]">分析</option>
                            <option value="评估" className="bg-[#0f172a]">评估</option>
                            <option value="创造" className="bg-[#0f172a]">创造</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          内容复杂度: {complexityLevel}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={complexityLevel}
                          onChange={(e) => setComplexityLevel(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>简单</span>
                          <span>适中</span>
                          <span>复杂</span>
                        </div>
                      </div>
                    </div>

                    {/* 生成按钮 */}
                    <motion.button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                      whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                      whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                    >
                      {isGenerating ? (
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {isGenerating ? '智能生成中...' : '生成个性化内容'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>

              {/* 右侧生成结果 */}
              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="glass-panel rounded-2xl border border-white/10 p-8 min-h-[600px]">
                  <div className="flex items-center mb-8">
                    <FileText className="w-6 h-6 text-cyan-400 mr-3" />
                    <h2 className="text-xl font-bold text-white">生成结果</h2>
                  </div>

                  {error ? (
                    <motion.div
                      className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-lg text-red-400 mb-2">生成失败</h3>
                        <p className="text-red-300/80">{error}</p>
                      </div>
                    </motion.div>
                  ) : isGenerating ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-cyan-500 rounded-full animate-spin absolute top-0 left-0" style={{
                          borderTopColor: 'transparent',
                          borderRightColor: 'transparent'
                        }}></div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mt-6 mb-2">
                        AI 正在智能生成内容...
                      </h3>
                      <p className="text-slate-400 text-center max-w-md">
                        正在分析您的学习特征和知识点要求，生成最适合的个性化学习内容
                      </p>
                      <p className="text-sm text-slate-500 mt-4">
                        预计需要 30-60 秒
                      </p>
                    </motion.div>
                  ) : generatedContent ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {isBackupContent && (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm flex items-start">
                          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">提示：</span>
                            <span className="ml-1 opacity-80">AI 服务暂时不可用，显示的是备用简化内容。请稍后再试。</span>
                          </div>
                        </div>
                      )}

                      <div className="prose prose-invert max-w-none">
                        <div className="bg-[#0f172a]/50 border border-emerald-500/20 rounded-xl p-8">
                          <div className="flex items-center mb-6">
                            <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                            <h3 className="text-lg font-semibold text-white m-0">生成成功！</h3>
                          </div>
                          <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                            {generatedContent}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-white/5">
                        <FileText className="w-10 h-10 text-slate-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        开始生成个性化学习内容
                      </h3>
                      <p className="text-slate-400 max-w-md mb-6">
                        请在左侧填写学习者特征和知识点信息，我们的 AI 将为您生成专属的学习内容
                      </p>
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-400">
                        <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                        内容将根据学习风格、认知水平等因素进行个性化调整
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}