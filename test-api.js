// API配置测试脚本 - 优化版
// 运行方法: node test-api.js

require('dotenv').config({ path: '.env.local' });

async function testAPIConfiguration() {
  console.log('🔍 API配置诊断开始 - 优化版\n');
  
  // 1. 检查环境变量
  console.log('=== 环境变量检查 ===');
  const fastgptKey = process.env.FASTGPT_API_KEY;
  const claudeKey = process.env.CLAUDE_API_KEY;
  const fastgptUrl = process.env.FASTGPT_API_URL;
  const claudeUrl = process.env.CLAUDE_API_URL;
  
  console.log('FASTGPT_API_KEY:', fastgptKey ? '✅ 已配置' : '❌ 未配置');
  console.log('CLAUDE_API_KEY:', claudeKey ? '✅ 已配置' : '❌ 未配置');
  console.log('FASTGPT_API_URL:', fastgptUrl || '❌ 未配置');
  console.log('CLAUDE_API_URL:', claudeUrl || '❌ 未配置');
  
  // 2. 检查密钥格式
  console.log('\n=== 密钥格式检查 ===');
  if (fastgptKey) {
    console.log('FastGPT密钥长度:', fastgptKey.length);
    console.log('FastGPT密钥前缀:', fastgptKey.substring(0, 15) + '...');
    console.log('FastGPT密钥有效:', fastgptKey.includes('your-') ? '❌ 仍为模板值' : '✅ 似乎有效');
  }
  
  if (claudeKey) {
    console.log('Claude密钥长度:', claudeKey.length);
    console.log('Claude密钥前缀:', claudeKey.substring(0, 15) + '...');
    console.log('Claude密钥有效:', claudeKey.includes('your-') ? '❌ 仍为模板值' : '✅ 似乎有效');
  }
  
  // 3. 选择要测试的API
  const apiKey = claudeKey || fastgptKey;
  const apiUrl = claudeUrl || fastgptUrl || 'https://api.fastgpt.io/api/v1/chat/completions';
  
  if (!apiKey || apiKey.includes('your-')) {
    console.log('\n❌ 没有有效的API密钥，无法进行API测试');
    console.log('请在 .env.local 文件中配置真实的API密钥');
    console.log('\n📝 配置步骤:');
    console.log('1. 获取FastGPT API密钥: https://fastgpt.io/');
    console.log('2. 或获取Claude API密钥: https://globalai.vip/');
    console.log('3. 编辑 .env.local 文件');
    console.log('4. 将 your-xxx-key 替换为真实密钥');
    return;
  }
  
  console.log('\n=== API连接测试 ===');
  console.log('使用API:', apiUrl);
  console.log('使用密钥:', apiKey.substring(0, 20) + '...');
  
  // 4. 进行多次测试以检验稳定性
  const testRounds = 3;
  let successCount = 0;
  let totalTime = 0;
  
  for (let round = 1; round <= testRounds; round++) {
    console.log(`\n🧪 第${round}轮测试:`);
    try {
      const startTime = Date.now();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20秒超时
      
      // 使用简短的测试请求，减少处理时间
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          messages: [
            {
              role: 'user',
              content: '请回复"OK"'
            }
          ],
          max_tokens: 10
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const endTime = Date.now();
      const duration = endTime - startTime;
      totalTime += duration;
      
      console.log(`⏱️ 响应时间: ${duration}ms`);
      console.log(`📥 响应状态: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ 测试成功！');
        
        // 尝试提取内容
        const content = data.choices?.[0]?.message?.content || data.content?.[0]?.text || '无法提取内容';
        console.log('AI响应:', content);
        successCount++;
      } else {
        const errorText = await response.text();
        console.log('❌ 测试失败');
        console.log('错误响应:', errorText.substring(0, 200));
        
        // 根据状态码给出建议
        if (response.status === 401) {
          console.log('💡 建议: API密钥无效或过期，请检查密钥是否正确');
        } else if (response.status === 403) {
          console.log('💡 建议: API访问被拒绝，可能是余额不足或权限问题');
        } else if (response.status === 429) {
          console.log('💡 建议: API调用频率超限，请稍后再试');
        } else if (response.status === 503 || response.status === 504) {
          console.log('💡 建议: API服务暂时不可用，请稍后再试');
        }
      }
      
    } catch (error) {
      console.log('❌ API调用异常:', error.message);
      
      if (error.name === 'AbortError') {
        console.log('💡 建议: API调用超时(>20秒)，服务可能繁忙');
      } else if (error.message.includes('fetch')) {
        console.log('💡 建议: 网络连接失败，请检查网络连接');
      }
    }
    
    // 测试间隔
    if (round < testRounds) {
      console.log('⏳ 等待2秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 5. 总结报告
  console.log('\n=== 诊断总结 ===');
  console.log(`✅ 成功率: ${successCount}/${testRounds} (${Math.round(successCount/testRounds*100)}%)`);
  if (successCount > 0) {
    console.log(`⏱️ 平均响应时间: ${Math.round(totalTime/successCount)}ms`);
  }
  
  if (successCount === testRounds) {
    console.log('🎉 所有测试通过！API配置正常，可以启动应用。');
    console.log('\n🚀 下一步：运行 npm run dev 启动开发服务器');
  } else if (successCount > 0) {
    console.log('⚠️ 部分测试成功，API可能不稳定。建议：');
    console.log('1. 检查网络连接稳定性');
    console.log('2. 确认API服务状态');
    console.log('3. 考虑增加重试机制');
  } else {
    console.log('❌ 所有测试失败，请检查配置和网络连接');
  }
  
  console.log('\n=== 性能建议 ===');
  if (totalTime / Math.max(successCount, 1) > 10000) {
    console.log('🐌 API响应较慢，建议：');
    console.log('- 减少请求内容长度');
    console.log('- 增加超时时间设置');
    console.log('- 考虑缓存机制');
  } else {
    console.log('🚀 API响应速度正常');
  }
  
  console.log('\n=== 诊断完成 ===');
}

// 运行测试
testAPIConfiguration().catch(console.error); 