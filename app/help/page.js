'use client';

import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Mail, Phone, Clock, Search, BookOpen, Target, FileText, Brain } from 'lucide-react';

export default function HelpPage() {
  const faqData = [
    {
      question: "如何开始使用EduPlatform？",
      answer: "您可以直接访问我们的功能模块，无需注册。推荐从智能出题+评估开始，了解您的学习水平，然后使用学习路径规划制定个性化学习计划。"
    },
    {
      question: "学习内容生成如何工作？",
      answer: "我们的AI系统会根据您的认知水平、学习风格、先验知识和学习动机，生成个性化的学习内容。只需填写相关信息，系统会自动为您量身定制学习材料。"
    },
    {
      question: "课程学习中的课程是真实的吗？",
      answer: "是的！我们精选了B站、中国大学MOOC等知名平台的优质课程，包括清华、北大等名校课程。点击课程卡片即可跳转到原平台学习。"
    },
    {
      question: "智能出题评估的准确性如何？",
      answer: "我们的AI评估系统基于先进的教育测量理论，能够精确评估您的学习水平并识别知识缺口，准确率达90%以上。"
    },
    {
      question: "学习路径规划可以修改吗？",
      answer: "当然可以！您可以随时调整学习目标、时间安排和学习偏好，系统会重新生成适合的学习路径。"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              帮助中心
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              欢迎来到EduPlatform帮助中心，这里有您需要的所有使用指南和常见问题解答
            </p>
          </motion.div>

          {/* 快速入门 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              快速入门
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">智能评估</h3>
                    <p className="text-gray-600 text-sm">使用智能出题+评估了解您的学习水平</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">制定计划</h3>
                    <p className="text-gray-600 text-sm">使用学习路径规划制定个性化学习计划</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-indigo-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">学习课程</h3>
                    <p className="text-gray-600 text-sm">浏览精选课程库，选择适合的学习内容</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">生成内容</h3>
                    <p className="text-gray-600 text-sm">使用学习内容生成获取个性化学习材料</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 常见问题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
              常见问题
            </h2>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 text-gray-600 bg-white rounded-b-lg border border-gray-100">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </motion.div>

          {/* 联系我们 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-blue-600" />
              联系我们
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">邮箱支持</h3>
                <p className="text-gray-600 text-sm">support@eduplatform.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">电话支持</h3>
                <p className="text-gray-600 text-sm">400-888-0088</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">服务时间</h3>
                <p className="text-gray-600 text-sm">周一至周五 9:00-18:00</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
} 