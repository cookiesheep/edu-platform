// API连接测试脚本
const https = require('https');

// 从temp.env读取配置
const fs = require('fs');
const path = require('path');

// 读取环境变量
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

const env = loadEnvFile('temp.env');
const apiKey = env.CLAUDE_API_KEY;
const apiUrl = env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';

console.log('=== API连接测试 ===');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : '未设置');
console.log('API URL:', apiUrl);

if (!apiKey) {
  console.error('❌ API密钥未设置');
  process.exit(1);
}

// 测试API连接
const testData = JSON.stringify({
  model: "claude-sonnet-4-20250514",
  max_tokens: 100,
  messages: [
    {
      role: "user",
      content: "Hello, this is a test message."
    }
  ]
});

const url = new URL(apiUrl);
const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'anthropic-version': '2023-06-01',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('\n🚀 发送测试请求...');

const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📥 响应数据:');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ API连接成功！');
      } else {
        console.log('\n❌ API调用失败');
      }
    } catch (e) {
      console.log('原始响应:', data);
      console.log('\n❌ 响应解析失败:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ 请求错误:', error.message);
});

req.write(testData);
req.end();
