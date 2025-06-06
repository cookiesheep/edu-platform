'use client';

import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Mail, Phone, Book, Video, Users, Search } from 'lucide-react';

export default function HelpPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              帮助中心
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              欢迎使用EduPlatform智能学习平台，我们提供全方位的帮助和支持
            </p>
          </motion.div>

          {/* 快速导航 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: <Book className="w-8 h-8" />, title: '使用指南', desc: '平台功能详细介绍' },
              { icon: <Video className="w-8 h-8" />, title: '视频教程', desc: '操作步骤视频演示' },
              { icon: <MessageCircle className="w-8 h-8" />, title: '在线客服', desc: '实时聊天支持' },
              { icon: <Mail className="w-8 h-8" />, title: '联系我们', desc: '邮件技术支持' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="text-blue-600 mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* 常见问题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl p-8 shadow-lg mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
              常见问题
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  question: '如何开始使用AI学习助手？',
                  answer: '您可以直接访问AI助手页面，无需登录即可体验基础功能。登录后可享受个性化对话记录和高级功能。'
                },
                {
                  question: '学习路径规划功能如何使用？',
                  answer: '在学习路径页面选择您的学习目标、当前水平和时间安排，系统会为您生成个性化的学习计划。'
                },
                {
                  question: '智能出题系统支持哪些学科？',
                  answer: '目前支持数学、语文、英语、物理、化学、生物等主流学科，覆盖小学到大学各个阶段。'
                },
                {
                  question: '如何获取真实的课程资源？',
                  answer: '我们整合了B站、中国大学MOOC等优质平台的课程，点击课程卡片即可直接跳转到对应平台学习。'
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 联系方式 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">需要更多帮助？</h2>
            <div className="flex justify-center space-x-8">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                support@eduplatform.com
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                400-123-4567
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
} 