'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const QuizGeneratorForm = ({ onGenerate, loading }) => {
  const [formData, setFormData] = useState({
    grade_level: '',
    subject: '',
    self_assessed_level: '',
    learning_goal: '',
    focus_areas: [], // 可选的重点领域
    quiz_time: '15', // 测试时长（分钟）
    question_count: 'auto' // 题目数量（自动或指定）
  });

  const [errors, setErrors] = useState({});

  // 年级选项
  const gradeOptions = [
    { value: '1-2', label: '小学低年级（1-2年级）' },
    { value: '3-4', label: '小学中年级（3-4年级）' },
    { value: '5-6', label: '小学高年级（5-6年级）' },
    { value: '7', label: '初一（7年级）' },
    { value: '8', label: '初二（8年级）' },
    { value: '9', label: '初三（9年级）' },
    { value: '10', label: '高一（10年级）' },
    { value: '11', label: '高二（11年级）' },
    { value: '12', label: '高三（12年级）' },
    { value: 'undergraduate', label: '大学本科' },
    { value: 'graduate', label: '研究生' }
  ];

  // 学科选项
  const subjectOptions = [
    { value: '数学', label: '数学', emoji: '🔢' },
    { value: '语文', label: '语文', emoji: '📚' },
    { value: '英语', label: '英语', emoji: '🇬🇧' },
    { value: '物理', label: '物理', emoji: '⚛️' },
    { value: '化学', label: '化学', emoji: '🧪' },
    { value: '生物', label: '生物', emoji: '🧬' },
    { value: '历史', label: '历史', emoji: '📜' },
    { value: '地理', label: '地理', emoji: '🌍' },
    { value: '政治', label: '政治', emoji: '🏛️' },
    { value: '计算机', label: '计算机', emoji: '💻' }
  ];

  // 自评水平选项
  const levelOptions = [
    { value: '入门级', label: '入门级', desc: '刚接触该学科或有明显知识缺口' },
    { value: '基础级', label: '基础级', desc: '掌握基本概念，但需要加强理解和应用' },
    { value: '中等级', label: '中等级', desc: '理解大部分概念，但在复杂问题上有困难' },
    { value: '进阶级', label: '进阶级', desc: '较好地掌握该学科，寻求深入理解和挑战' }
  ];

  // 学习目标选项
  const goalOptions = [
    { value: '查漏补缺', label: '查漏补缺', desc: '找出并弥补知识盲点' },
    { value: '能力提升', label: '能力提升', desc: '提高解题和应用能力' },
    { value: '考试准备', label: '考试准备', desc: '为特定考试做准备' },
    { value: '兴趣探索', label: '兴趣探索', desc: '出于兴趣深入学习' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.grade_level) {
      newErrors.grade_level = '请选择年级';
    }
    if (!formData.subject) {
      newErrors.subject = '请选择学科';
    }
    if (!formData.self_assessed_level) {
      newErrors.self_assessed_level = '请选择自评水平';
    }
    if (!formData.learning_goal) {
      newErrors.learning_goal = '请选择学习目标';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onGenerate(formData);
    }
  };

  const getSelectedSubject = () => {
    return subjectOptions.find(opt => opt.value === formData.subject);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">⚙️</span>
        试题生成配置
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 年级选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎓 年级水平 *
          </label>
          <select
            value={formData.grade_level}
            onChange={(e) => handleChange('grade_level', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.grade_level ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">请选择年级</option>
            {gradeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.grade_level && (
            <p className="mt-1 text-sm text-red-600">{errors.grade_level}</p>
          )}
        </div>

        {/* 学科选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📖 学科选择 *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {subjectOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange('subject', option.value)}
                className={`p-3 border rounded-md text-sm font-medium transition-colors ${
                  formData.subject === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{option.emoji}</span>
                {option.label}
              </button>
            ))}
          </div>
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* 自评水平 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📊 自评水平 *
          </label>
          <div className="space-y-2">
            {levelOptions.map(option => (
              <label
                key={option.value}
                className={`block p-3 border rounded-md cursor-pointer transition-colors ${
                  formData.self_assessed_level === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="self_assessed_level"
                  value={option.value}
                  checked={formData.self_assessed_level === option.value}
                  onChange={(e) => handleChange('self_assessed_level', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {option.desc}
                    </div>
                  </div>
                  <div className={`w-4 h-4 border-2 rounded-full mt-0.5 ${
                    formData.self_assessed_level === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.self_assessed_level === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.self_assessed_level && (
            <p className="mt-1 text-sm text-red-600">{errors.self_assessed_level}</p>
          )}
        </div>

        {/* 学习目标 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 学习目标 *
          </label>
          <div className="grid grid-cols-1 gap-2">
            {goalOptions.map(option => (
              <label
                key={option.value}
                className={`block p-3 border rounded-md cursor-pointer transition-colors ${
                  formData.learning_goal === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="learning_goal"
                  value={option.value}
                  checked={formData.learning_goal === option.value}
                  onChange={(e) => handleChange('learning_goal', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {option.desc}
                    </div>
                  </div>
                  <div className={`w-4 h-4 border-2 rounded-full mt-0.5 ${
                    formData.learning_goal === option.value
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.learning_goal === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.learning_goal && (
            <p className="mt-1 text-sm text-red-600">{errors.learning_goal}</p>
          )}
        </div>

        {/* 高级选项 */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            ⚡ 高级选项 (可选)
          </summary>
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
            {/* 测试时长 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏱️ 测试时长（分钟）
              </label>
              <select
                value={formData.quiz_time}
                onChange={(e) => handleChange('quiz_time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="10">10分钟（快速测试）</option>
                <option value="15">15分钟（标准测试）</option>
                <option value="20">20分钟（深度测试）</option>
              </select>
            </div>

            {/* 题目数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 题目数量
              </label>
              <select
                value={formData.question_count}
                onChange={(e) => handleChange('question_count', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto">自动调整（推荐）</option>
                <option value="8">8题（简单测试）</option>
                <option value="12">12题（标准测试）</option>
                <option value="16">16题（完整测试）</option>
              </select>
            </div>
          </div>
        </details>

        {/* 生成按钮 */}
        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              正在生成试题...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="mr-2">🚀</span>
              生成 {getSelectedSubject()?.label} 试题
            </span>
          )}
        </motion.button>

        {/* 提示信息 */}
        <div className="text-xs text-gray-500 text-center">
          <p>💡 试题将根据您的选择自动调整难度和内容覆盖范围</p>
        </div>
      </form>
    </motion.div>
  );
};

export default QuizGeneratorForm; 