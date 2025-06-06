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

      const formData = {
        cognitive_level: cognitiveLevel,
        prior_knowledge: priorKnowledge,
        learning_style: learningStyle,
        motivation_type: motivationType,
        knowledge_point: knowledgePoint,
        subject_domain: subjectDomain,
        concept_type: conceptType,
        complexity_level: complexityLevel,
        prerequisite_concepts: prerequisiteConcepts,
        learning_objective: learningObjective,
        language_complexity: 3,
        content_density: 3,
        example_ratio: 3,
        interactivity_level: 3,
        cross_discipline_level: 2
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);
      
      try {
        const response = await fetch('/api/content-generator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '内容生成失败');
        }
  
        const data = await response.json();
        setGeneratedContent(data.content);
        
        if (data.isBackup) {
          setIsBackupContent(true);
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('请求超时，请稍后再试');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* 页面标题 */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  智能学习内容生成
                </h1>
                <p className="text-xl text-gray-600">
                  基于AI的个性化学习内容生成系统
                </p>
              </div>
            </div>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
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
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sticky top-8">
                <div className="flex items-center mb-6">
                  <Sparkles className="w-6 h-6 text-blue-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">内容生成参数</h2>
                </div>
                
                <form onSubmit={handleGenerateContent} className="space-y-6">
                  
                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-600 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      知识点信息
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        知识点 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={knowledgePoint}
                        onChange={(e) => setKnowledgePoint(e.target.value)}
                        placeholder="请输入具体知识点，如「二次方程求解」"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        学科领域 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={subjectDomain}
                        onChange={(e) => setSubjectDomain(e.target.value)}
                        placeholder="请输入学科领域，如「高中数学」"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        先决知识
                      </label>
                      <input
                        type="text"
                        value={prerequisiteConcepts}
                        onChange={(e) => setPrerequisiteConcepts(e.target.value)}
                        placeholder="如「一次方程、代数运算」"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* 学习者模型 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-600 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      学习者特征
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">认知水平</label>
                        <select
                          value={cognitiveLevel}
                          onChange={(e) => setCognitiveLevel(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="初级认知">初级认知</option>
                          <option value="中级认知">中级认知</option>
                          <option value="高级认知">高级认知</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">先验知识</label>
                        <select
                          value={priorKnowledge}
                          onChange={(e) => setPriorKnowledge(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="基础">基础</option>
                          <option value="中等">中等</option>
                          <option value="深入">深入</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">学习风格</label>
                        <select
                          value={learningStyle}
                          onChange={(e) => setLearningStyle(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="视觉型">视觉型</option>
                          <option value="文本型">文本型</option>
                          <option value="应用型">应用型</option>
                          <option value="社交型">社交型</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">学习目标</label>
                        <select
                          value={learningObjective}
                          onChange={(e) => setLearningObjective(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="记忆">记忆</option>
                          <option value="理解">理解</option>
                          <option value="应用">应用</option>
                          <option value="分析">分析</option>
                          <option value="评估">评估</option>
                          <option value="创造">创造</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        内容复杂度: {complexityLevel}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={complexityLevel}
                        onChange={(e) => setComplexityLevel(parseInt(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
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
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
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
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 min-h-[600px]">
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-blue-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">生成结果</h2>
                </div>
                
                {error ? (
                  <motion.div
                    className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-start"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg text-red-700 mb-2">生成失败</h3>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </motion.div>
                ) : isGenerating ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                      <div className="w-20 h-20 border-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0" style={{
                        borderTopColor: 'transparent',
                        borderRightColor: 'transparent'
                      }}></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
                      AI正在智能生成内容...
                    </h3>
                    <p className="text-gray-600 text-center max-w-md">
                      正在分析您的学习特征和知识点要求，生成最适合的个性化学习内容
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      预计需要 30-90 秒
                    </p>
                  </motion.div>
                ) : generatedContent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {isBackupContent && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm flex items-start">
                        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">提示：</span>
                          <span className="ml-1">AI服务暂时不可用，显示的是备用简化内容。请稍后再试。</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="prose max-w-none">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                          <h3 className="text-lg font-semibold text-gray-800">生成成功！</h3>
                        </div>
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {generatedContent}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                      <FileText className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      开始生成个性化学习内容
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      请在左侧填写学习者特征和知识点信息，我们的AI将为您生成专属的学习内容
                    </p>
                    <div className="mt-6 text-sm text-gray-500">
                      💡 内容将根据学习风格、认知水平等因素进行个性化调整
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 