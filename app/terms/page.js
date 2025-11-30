'use client';

import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FileText, Scale, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#020617] py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20">
                <Scale className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              服务条款
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              欢迎使用EduPlatform智能学习平台，请仔细阅读以下服务条款
            </p>
            <p className="text-sm text-slate-500 mt-2">
              最后更新时间：2024年3月15日
            </p>
          </motion.div>

          {/* 服务简介 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-8 mb-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-cyan-400" />
              服务简介
            </h2>
            <div className="space-y-4 text-slate-400">
              <p>
                EduPlatform（以下简称"本平台"）是一个集成了AI辅助学习、智能出题评估、学习路径规划等功能的智能教育学习平台。
              </p>
              <p>
                通过使用本平台，您同意遵守以下服务条款。如果您不同意这些条款，请不要使用本平台。
              </p>
            </div>
          </motion.div>

          {/* 用户权利与义务 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-8 mb-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-cyan-400" />
              用户权利与义务
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                  您的权利
                </h3>
                <ul className="space-y-2 text-slate-400">
                  <li>• 免费使用平台基础功能</li>
                  <li>• 获得个性化学习建议</li>
                  <li>• 访问优质课程资源</li>
                  <li>• 保护个人信息安全</li>
                  <li>• 随时停止使用服务</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-400" />
                  您的义务
                </h3>
                <ul className="space-y-2 text-slate-400">
                  <li>• 提供真实的学习信息</li>
                  <li>• 合理使用平台资源</li>
                  <li>• 遵守相关法律法规</li>
                  <li>• 尊重他人的学习权益</li>
                  <li>• 不滥用或破坏平台功能</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 服务内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl p-8 mb-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">服务内容</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">核心功能</h3>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-slate-200">智能出题+评估：</strong>AI自动生成题目并评估学习效果</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-slate-200">学习路径规划：</strong>个性化学习计划制定</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-slate-200">课程学习：</strong>优质课程资源聚合</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong className="text-slate-200">内容生成：</strong>个性化学习内容生成</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">服务特点</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>• 基于AI的智能化学习支持</li>
                  <li>• 个性化学习路径推荐</li>
                  <li>• 实时学习进度跟踪</li>
                  <li>• 多平台课程资源整合</li>
                  <li>• 全天候在线学习支持</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 免责声明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-2xl p-8 mb-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <XCircle className="w-6 h-6 mr-2 text-red-400" />
              免责声明
            </h2>

            <div className="space-y-4 text-slate-400">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI服务说明</h3>
                <p>本平台的AI功能基于先进的机器学习技术，但不保证100%的准确性。AI生成的内容仅供参考，不应作为最终决策的唯一依据。</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">第三方内容</h3>
                <p>平台整合的第三方课程和资源由原平台提供，我们不对其内容准确性、完整性或适用性承担责任。</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">技术限制</h3>
                <p>由于技术和网络环境限制，服务可能存在中断或故障的情况，我们将尽力保证服务的稳定性。</p>
              </div>
            </div>
          </motion.div>

          {/* 服务变更 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-2xl p-8 mb-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">服务变更与终止</h2>

            <div className="space-y-4 text-slate-400">
              <p>
                我们保留在任何时候修改、暂停或终止部分或全部服务的权利。如果进行重大变更，我们会提前通知用户。
              </p>
              <p>
                用户可以随时停止使用我们的服务。如果您选择注册了账户，也可以随时删除您的账户和相关数据。
              </p>
            </div>
          </motion.div>

          {/* 联系信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl p-8 text-center shadow-lg shadow-cyan-500/20"
          >
            <h2 className="text-2xl font-bold mb-4">条款相关咨询</h2>
            <p className="mb-6 opacity-90">
              如果您对服务条款有任何疑问，请联系我们的客服团队
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <strong>客服邮箱：</strong><br />
                support@eduplatform.com
              </div>
              <div>
                <strong>客服热线：</strong><br />
                400-888-0088
              </div>
            </div>
            <p className="mt-6 text-sm opacity-75">
              感谢您选择EduPlatform，祝您学习愉快！
            </p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}