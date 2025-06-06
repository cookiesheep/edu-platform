'use client';

import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, FileText, AlertTriangle } from 'lucide-react';

export default function PrivacyPage() {
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
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              隐私政策
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              EduPlatform致力于保护您的个人隐私，以下是我们的隐私保护承诺和政策说明
            </p>
            <p className="text-sm text-gray-500 mt-2">
              最后更新时间：2024年3月15日
            </p>
          </motion.div>

          {/* 隐私承诺 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-blue-600" />
              我们的承诺
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">数据加密</h3>
                <p className="text-gray-600 text-sm">所有用户数据均采用业界标准的加密技术进行保护</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">透明使用</h3>
                <p className="text-gray-600 text-sm">我们会明确告知您数据的收集目的和使用方式</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">用户控制</h3>
                <p className="text-gray-600 text-sm">您可以随时查看、修改或删除您的个人信息</p>
              </div>
            </div>
          </motion.div>

          {/* 信息收集 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">信息收集与使用</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">我们收集的信息类型</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>账户信息：</strong>邮箱地址、用户名（仅在您选择注册时）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>学习数据：</strong>测试结果、学习进度、学习偏好设置</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>使用数据：</strong>功能使用统计、访问时间（匿名化处理）</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">信息使用目的</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>提供个性化的学习内容和路径推荐</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>优化平台功能和用户体验</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>提供技术支持和客户服务</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 数据保护 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">数据保护措施</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">技术保护</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• SSL/TLS 加密传输</li>
                  <li>• 数据库加密存储</li>
                  <li>• 访问权限控制</li>
                  <li>• 定期安全审计</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">管理保护</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 员工隐私培训</li>
                  <li>• 最小权限原则</li>
                  <li>• 数据访问日志</li>
                  <li>• 应急响应机制</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 用户权利 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">您的权利</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">查看权</h3>
                  <p className="text-gray-600 text-sm">您有权查看我们收集的关于您的所有个人信息</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">修改权</h3>
                  <p className="text-gray-600 text-sm">您可以随时更新或修正您的个人信息</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">删除权</h3>
                  <p className="text-gray-600 text-sm">您可以要求删除您的账户和相关数据</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 联系方式 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">隐私问题咨询</h2>
            <p className="mb-6 opacity-90">
              如果您对我们的隐私政策有任何疑问或关注，请随时联系我们
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <strong>隐私保护邮箱：</strong><br />
                privacy@eduplatform.com
              </div>
              <div>
                <strong>客服热线：</strong><br />
                400-888-0088
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
} 