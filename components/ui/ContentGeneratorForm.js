'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const ContentGeneratorForm = ({ onSubmit, isGenerating }) => {
  // 学习者模型参数
  const [cognitiveLevel, setCognitiveLevel] = useState('中级认知');
  const [priorKnowledge, setPriorKnowledge] = useState('中等');
  const [learningStyle, setLearningStyle] = useState('视觉型');
  const [motivationType, setMotivationType] = useState('兴趣驱动');
  
  // 知识点特征参数
  const [knowledgePoint, setKnowledgePoint] = useState('');
  const [subjectDomain, setSubjectDomain] = useState('');
  const [conceptType, setConceptType] = useState('概念型');
  const [complexityLevel, setComplexityLevel] = useState(3);
  const [prerequisiteConcepts, setPrerequisiteConcepts] = useState('');
  const [learningObjective, setLearningObjective] = useState('理解');
  
  // 内容调整修饰符
  const [languageComplexity, setLanguageComplexity] = useState(3);
  const [contentDensity, setContentDensity] = useState(3);
  const [exampleRatio, setExampleRatio] = useState(3);
  const [interactivityLevel, setInteractivityLevel] = useState(3);
  const [crossDisciplineLevel, setCrossDisciplineLevel] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!knowledgePoint.trim()) {
      alert('请填写知识点');
      return;
    }
    
    if (!subjectDomain.trim()) {
      alert('请填写学科领域');
      return;
    }
    
    const formData = {
      // 学习者模型
      cognitive_level: cognitiveLevel,
      prior_knowledge: priorKnowledge,
      learning_style: learningStyle,
      motivation_type: motivationType,
      
      // 知识点特征
      knowledge_point: knowledgePoint,
      subject_domain: subjectDomain,
      concept_type: conceptType,
      complexity_level: complexityLevel,
      prerequisite_concepts: prerequisiteConcepts,
      learning_objective: learningObjective,
      
      // 内容调整修饰符
      language_complexity: languageComplexity,
      content_density: contentDensity,
      example_ratio: exampleRatio,
      interactivity_level: interactivityLevel,
      cross_discipline_level: crossDisciplineLevel
    };
    
    onSubmit(formData);
  };
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xl font-bold mb-4 pb-2 border-b">学习内容生成参数</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 基本信息 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-primary-600">知识点信息</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              知识点 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={knowledgePoint}
              onChange={(e) => setKnowledgePoint(e.target.value)}
              placeholder="请输入具体知识点，如「二次方程求解」"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              学科领域 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subjectDomain}
              onChange={(e) => setSubjectDomain(e.target.value)}
              placeholder="请输入学科领域，如「高中数学」"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              相关先决知识
            </label>
            <input
              type="text"
              value={prerequisiteConcepts}
              onChange={(e) => setPrerequisiteConcepts(e.target.value)}
              placeholder="请输入相关先决知识，如「一次方程、代数运算」"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        {/* 学习者模型 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-primary-600">学习者模型</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                认知维度
              </label>
              <select
                value={cognitiveLevel}
                onChange={(e) => setCognitiveLevel(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="初级认知">初级认知</option>
                <option value="中级认知">中级认知</option>
                <option value="高级认知">高级认知</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                先验知识
              </label>
              <select
                value={priorKnowledge}
                onChange={(e) => setPriorKnowledge(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="基础">基础</option>
                <option value="中等">中等</option>
                <option value="深入">深入</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学习风格
              </label>
              <select
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="视觉型">视觉型</option>
                <option value="文本型">文本型</option>
                <option value="应用型">应用型</option>
                <option value="社交型">社交型</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学习动机
              </label>
              <select
                value={motivationType}
                onChange={(e) => setMotivationType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="任务导向">任务导向</option>
                <option value="兴趣驱动">兴趣驱动</option>
                <option value="成就导向">成就导向</option>
                <option value="应用导向">应用导向</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* 知识点特征 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-primary-600">知识点特征</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                概念类型
              </label>
              <select
                value={conceptType}
                onChange={(e) => setConceptType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="事实型">事实型（需记忆的信息）</option>
                <option value="程序型">程序型（需执行的步骤）</option>
                <option value="概念型">概念型（需理解的抽象概念）</option>
                <option value="原理型">原理型（需应用的基本规律）</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学习目标
              </label>
              <select
                value={learningObjective}
                onChange={(e) => setLearningObjective(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              复杂度级别: {complexityLevel}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={complexityLevel}
              onChange={(e) => setComplexityLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>简单</span>
              <span>适中</span>
              <span>复杂</span>
            </div>
          </div>
        </div>
        
        {/* 内容调整修饰符 - 折叠面板 */}
        <details className="mb-6 bg-gray-50 p-3 rounded-lg">
          <summary className="text-lg font-semibold cursor-pointer text-primary-600 pb-2">
            高级内容调整（可选）
          </summary>
          
          <div className="pt-3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                语言复杂度: {languageComplexity}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={languageComplexity}
                onChange={(e) => setLanguageComplexity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>简单</span>
                <span>适中</span>
                <span>复杂</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容密度: {contentDensity}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={contentDensity}
                onChange={(e) => setContentDensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>精简</span>
                <span>适中</span>
                <span>详尽</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                实例比例: {exampleRatio}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={exampleRatio}
                onChange={(e) => setExampleRatio(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>少量</span>
                <span>适中</span>
                <span>大量</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                互动程度: {interactivityLevel}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={interactivityLevel}
                onChange={(e) => setInteractivityLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>被动</span>
                <span>适中</span>
                <span>高互动</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学科关联度: {crossDisciplineLevel}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={crossDisciplineLevel}
                onChange={(e) => setCrossDisciplineLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>单一学科</span>
                <span>适当关联</span>
                <span>跨学科</span>
              </div>
            </div>
          </div>
        </details>
        
        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transition-colors ${
            isGenerating ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? '正在生成...' : '生成个性化学习内容'}
        </button>
      </form>
    </motion.div>
  );
};

export default ContentGeneratorForm; 