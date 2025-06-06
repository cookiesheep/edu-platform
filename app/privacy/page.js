'use client';

import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Users, Database, FileText } from 'lucide-react';

export default function PrivacyPage() {
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
              隐私政策
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              我们重视您的隐私，致力于保护您的个人信息安全
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* 隐私承诺 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">我们的承诺</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                EduPlatform（以下简称"我们"）承诺保护您的隐私。本隐私政策说明了我们如何收集、使用、储存和保护您的个人信息。
              </p>
              <p className="text-gray-600 leading-relaxed">
                使用我们的服务即表示您同意本政策。我们可能会定期更新此政策，任何重大变更都会提前通知您。
              </p>
            </motion.div>

            {/* 信息收集 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <Database className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">信息收集</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">我们收集的信息类型：</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>账户信息：用户名、邮箱地址等注册信息</li>
                    <li>学习数据：学习进度、测试成绩、课程偏好等</li>
                    <li>使用信息：访问日志、设备信息、IP地址等</li>
                    <li>交互数据：与AI助手的对话记录（可选保存）</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 信息使用 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">信息使用</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">我们使用您的信息来：</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>提供个性化的学习体验和内容推荐</li>
                    <li>分析学习效果，优化AI算法和课程设计</li>
                    <li>维护账户安全，防止欺诈行为</li>
                    <li>改善产品功能，提供技术支持</li>
                    <li>发送重要通知和更新信息</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 信息保护 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <Lock className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">信息保护</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">安全措施：</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>使用SSL加密传输保护数据安全</li>
                    <li>严格的访问控制和权限管理</li>
                    <li>定期安全审计和漏洞扫描</li>
                    <li>数据备份和灾难恢复机制</li>
                    <li>员工安全培训和保密协议</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 用户权利 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg mb-8"
            >
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">您的权利</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">您有权：</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>访问和查看您的个人信息</li>
                    <li>更正或更新不准确的信息</li>
                    <li>删除您的账户和相关数据</li>
                    <li>导出您的学习数据</li>
                    <li>选择是否接收营销信息</li>
                    <li>撤回对数据处理的同意</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 联系我们 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">联系我们</h2>
              <p className="text-gray-600 mb-4">
                如果您对我们的隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
              </p>
              <div className="space-y-2 text-gray-600">
                <p>邮箱：privacy@eduplatform.com</p>
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