'use client';

import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertTriangle, CheckCircle, Info, Mail } from 'lucide-react';

export default function TermsPage() {
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
              服务条款
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              使用EduPlatform前，请仔细阅读并同意以下服务条款
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* 服务协议 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <Scale className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">服务协议</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                欢迎使用EduPlatform智能学习平台！通过注册账户或使用我们的服务，您确认已阅读、理解并同意遵守本服务条款。
              </p>
              <p className="text-gray-600 leading-relaxed">
                本协议构成您与EduPlatform之间的法律协议。如果您不同意这些条款，请不要使用我们的服务。
              </p>
            </motion.div>

            {/* 服务内容 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <CheckCircle className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">服务内容</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">EduPlatform提供的服务包括：</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>智能学习路径规划和个性化推荐</li>
                    <li>AI驱动的出题和评估系统</li>
                    <li>智能学习内容生成</li>
                    <li>优质教育资源聚合和推荐</li>
                    <li>学习数据分析和进度跟踪</li>
                    <li>AI学习助手和智能问答</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 用户责任 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <Info className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">用户责任</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">使用我们的服务时，您同意：</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>提供真实、准确、完整的注册信息</li>
                    <li>保护您的账户安全，不与他人共享账户</li>
                    <li>遵守所有适用的法律法规</li>
                    <li>不进行任何可能损害平台或其他用户的行为</li>
                    <li>尊重知识产权，不侵犯他人权利</li>
                    <li>正当使用AI工具，不生成有害内容</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 禁止行为 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">禁止行为</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">以下行为被严格禁止：</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>上传或传播违法、有害、威胁、诽谤的内容</li>
                    <li>尝试未经授权访问系统或其他用户数据</li>
                    <li>进行任何可能干扰或破坏服务的活动</li>
                    <li>使用自动化工具恶意抓取数据</li>
                    <li>冒充他人或虚假陈述身份</li>
                    <li>商业化使用平台内容而未获得许可</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 知识产权 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">知识产权</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  EduPlatform及其所有内容、功能和特性（包括但不限于信息、软件、文本、显示、图像、视频和音频，以及其设计、选择和排列）均为EduPlatform或其许可方所有。
                </p>
                <p className="text-gray-600 leading-relaxed">
                  您可以为个人学习目的使用我们的服务和内容，但不得复制、修改、分发或以其他方式使用任何内容用于商业目的。
                </p>
              </div>
            </motion.div>

            {/* 免责声明 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">免责声明</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  我们努力提供准确、可靠的服务，但不能保证服务的绝对准确性或完整性。AI生成的内容仅供参考，您应当独立验证重要信息。
                </p>
                <p className="text-gray-600 leading-relaxed">
                  我们不对因使用或无法使用我们的服务而导致的任何直接、间接、偶然、特殊或后果性损害承担责任。
                </p>
              </div>
            </motion.div>

            {/* 联系信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">联系我们</h2>
              <p className="text-gray-600 mb-4">
                如果您对本服务条款有任何疑问，请通过以下方式联系我们：
              </p>
              <div className="space-y-2 text-gray-600">
                <p>邮箱：legal@eduplatform.com</p>
                <p>电话：400-123-4567</p>
                <p>地址：北京市朝阳区xxx街道xxx号</p>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                最后更新时间：2024年3月15日
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 