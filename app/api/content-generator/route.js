import { NextResponse } from 'next/server';

// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.FASTGPT_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || process.env.FASTGPT_API_URL || 'https://api.fastgpt.io/api/v1/chat/completions';
const BACKUP_API_URL = 'https://globalai.vip/v1/messages'; // 尝试标准Claude API格式
const API_TIMEOUT = 60000; // 增加到60秒超时，避免504错误

// 强制使用真实API，禁用模拟数据
const USE_MOCK_API = false;

/**
 * 学习内容生成API
 */
export async function POST(request) {
  try {
    // 详细的API配置检查和日志
    console.log('=== 内容生成API配置检查 ===');
    console.log('CLAUDE_API_KEY存在:', !!CLAUDE_API_KEY);
    console.log('CLAUDE_API_KEY长度:', CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0);
    console.log('CLAUDE_API_KEY前缀:', CLAUDE_API_KEY ? CLAUDE_API_KEY.substring(0, 20) + '...' : 'undefined');
    console.log('CLAUDE_API_URL:', CLAUDE_API_URL);
    console.log('API_TIMEOUT:', API_TIMEOUT);
    
    // 检查API配置
    if (!CLAUDE_API_KEY) {
      console.error('❌ API密钥未配置');
      return NextResponse.json(
        { error: 'API服务未配置，请联系管理员' },
        { status: 500 }
      );
    }

    if (CLAUDE_API_KEY.includes('your-') || CLAUDE_API_KEY.length < 20) {
      console.error('❌ API密钥无效，仍为模板值');
      return NextResponse.json(
        { error: 'API密钥未正确配置，请检查.env.local文件并填入真实的API密钥' },
        { status: 500 }
      );
    }

    // 解析请求体
    const requestData = await request.json();
    
    console.log('✅ 接收到内容生成请求:', {
      knowledge_point: requestData.knowledge_point,
      subject_domain: requestData.subject_domain,
      cognitive_level: requestData.cognitive_level
    });
    
    // 构建精简的系统提示词
    const systemPrompt = buildOptimizedSystemPrompt(requestData);
    
    // 使用简化的用户提示词
    const userPrompt = `请为${requestData.cognitive_level}水平学习者生成关于"${requestData.knowledge_point}"的学习指南。采用${requestData.learning_style}学习方式，目标是${requestData.learning_objective}。要求简洁实用。`;
    
    // 使用重试机制调用API
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🚀 开始第${attempt}次内容生成API调用...`);
        const apiResponse = await callClaudeAPIWithRetry(CLAUDE_API_URL, systemPrompt, userPrompt, attempt);
        
        console.log(`✅ 内容生成成功（第${attempt}次尝试）`);
        
        return NextResponse.json({ 
          success: true,
          content: apiResponse.trim(),
          metadata: {
            attempt: attempt,
            timestamp: new Date().toISOString()
          }
        });
      } catch (apiError) {
        console.error(`❌ 第${attempt}次API调用失败:`, apiError.message);
        lastError = apiError;
        
        if (apiError.name === 'AbortError' && attempt < maxRetries) {
          console.log(`⏳ 超时重试，等待2秒...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        } else if (apiError.message.includes('fetch') && attempt < maxRetries) {
          console.log(`⏳ 网络错误重试，等待3秒...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        } else if (apiError.message.includes('429') && attempt < maxRetries) {
          console.log(`⏳ API限流重试，等待2秒...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        } else {
          // 其他错误或最后一次重试，退出循环
          break;
        }
      }
    }

    // 所有重试都失败了
    console.error('❌ 所有内容生成重试都失败了');
    return NextResponse.json(
      { 
        error: `AI服务暂时不可用（已重试${maxRetries}次）：${lastError.message}。请稍后再试。`,
        details: 'API调用失败',
        debug_info: {
          api_url: CLAUDE_API_URL,
          has_key: !!CLAUDE_API_KEY,
          error_type: lastError.name,
          max_retries: maxRetries
        }
      },
      { status: 503 }
    );
  } catch (error) {
    console.error('❌ 内容生成API错误:', error);
    return NextResponse.json(
      { 
        error: `请求处理失败: ${error.message}`,
        debug_info: {
          timestamp: new Date().toISOString(),
          api_configured: !!CLAUDE_API_KEY
        }
      },
      { status: 400 }
    );
  }
}

/**
 * 构建优化的系统提示词 - 大幅简化以减少请求体大小
 */
function buildOptimizedSystemPrompt(data) {
  return `您是EduSage学习内容生成系统。

学习者：${data.cognitive_level}水平，${data.learning_style}学习方式
目标：${data.learning_objective}

请生成关于"${data.knowledge_point}"的学习指南，包含：

1. 📚 概念解析（简洁易懂）
2. 🎯 学习目标（3-5个要点）
3. 💡 核心内容（重点突出）
4. 🔍 实例应用（2-3个案例）
5. ✅ 自我检测（简单问题）
6. 📖 资源推荐

要求：
- 适合${data.cognitive_level}水平
- 采用${data.learning_style}表达方式
- 简洁实用，重点突出
- 避免冗长理论${data.learning_style === '视觉型' ? '\n- 可添加简单图表说明' : ''}`;
}

// 从API响应中提取文本内容，尝试多种可能的响应格式
function extractContentFromResponse(data) {
  console.log('尝试从响应中提取内容，响应格式:', typeof data);
  
  // 如果是字符串，直接返回
  if (typeof data === 'string') {
    return data;
  }
  
  try {
    // 尝试方法1: Claude标准格式 {content: [{type: "text", text: "..."}]}
    if (data.content && Array.isArray(data.content)) {
      const textContent = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n\n');
        
      if (textContent) {
        console.log('使用content[].text格式提取成功');
        return textContent;
      }
    }
    
    // 尝试方法2: OpenAI格式 {choices: [{message: {content: "..."}}]}
    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
      if (data.choices[0].message && data.choices[0].message.content) {
        console.log('使用choices[0].message.content格式提取成功');
        return data.choices[0].message.content;
      }
      
      if (data.choices[0].text) {
        console.log('使用choices[0].text格式提取成功');
        return data.choices[0].text;
      }
    }
    
    // 尝试方法3: 直接text字段
    if (data.text) {
      console.log('使用data.text格式提取成功');
      return data.text;
    }
    
    // 尝试方法4: 直接answer字段
    if (data.answer) {
      console.log('使用data.answer格式提取成功');
      return data.answer;
    }
    
    // 尝试方法5: 找到任何可能包含文本的字段
    for (const key in data) {
      if (typeof data[key] === 'string' && data[key].length > 100) {
        console.log(`使用data.${key}格式提取成功`);
        return data[key];
      }
    }
    
    // 如果未找到任何文本内容，则将整个响应转换为字符串
    console.log('未找到结构化文本内容，返回整个响应');
    return JSON.stringify(data);
  } catch (error) {
    console.error('提取内容时出错:', error);
    return JSON.stringify(data);
  }
}

/**
 * 调用Claude API（带重试机制）
 */
async function callClaudeAPIWithRetry(apiUrl, systemPrompt, userPrompt, attempt) {
  try {
    console.log(`调用Claude API (${apiUrl}) - 第${attempt}次尝试...`);
    
    // 使用AbortController设置超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    // 使用简单稳定的模型
    const selectedModel = 'claude-3-5-sonnet-20241022';
    
    console.log('系统提示词长度:', systemPrompt.length);
    console.log('用户提示词:', userPrompt);
    
    // 准备请求体 - 使用标准的Claude API格式
    const requestBody = {
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000 // 减少token数量，提高响应速度
    };
    
    console.log(`使用模型: ${selectedModel}`);
    console.log('请求体大小:', JSON.stringify(requestBody).length, 'bytes');
    
    // 添加必要的请求头
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${CLAUDE_API_KEY}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);  // 清除超时设置
    
    console.log('API响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API错误状态码:', response.status);
      console.error('Claude API错误响应:', errorText);
      throw new Error(`API请求失败(${response.status}): ${errorText}`);
    }
    
    const responseText = await response.text();
    console.log('原始响应文本长度:', responseText.length);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      console.error('收到的文本:', responseText.substring(0, 200) + '...');
      
      // 如果不是JSON格式，但是看起来像是文本内容，就直接返回
      if (responseText && responseText.length > 50 && !responseText.startsWith('<')) {
        console.log('响应不是JSON，但可能是文本内容，直接返回');
        return responseText;
      }
      
      throw new Error(`无法解析API响应: ${parseError.message}`);
    }
    
    console.log('Claude API响应结构:', Object.keys(data));
    
    // 尝试从各种可能的响应格式中提取内容
    const textContent = extractContentFromResponse(data);
    
    if (!textContent) {
      console.error('无法从响应中提取文本内容:', JSON.stringify(data).substring(0, 300));
      throw new Error('无法从响应中提取文本内容');
    }
    
    console.log('成功提取文本内容长度:', textContent.length);
    return textContent;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('API请求超时，请稍后再试');
    }
    console.error('调用Claude API出错:', error);
    throw error;
  }
}

/**
 * 调用Claude API（旧版本，保留作为备用）
 */
async function callClaudeAPI(apiUrl, systemPrompt, userPrompt) {
  return callClaudeAPIWithRetry(apiUrl, systemPrompt, userPrompt, 1);
}

/**
 * 生成备用内容（当API调用失败时使用）
 */
function generateFallbackContent(data) {
  const { knowledge_point, subject_domain, cognitive_level, learning_style, motivation_type } = data;
  
  return `# ${knowledge_point} 个性化学习指南

## 📚 学习路径导航
> 这份内容是针对${cognitive_level}学习者，采用${learning_style}学习方式定制的${subject_domain}中关于${knowledge_point}的学习指南。

### 🎯 本单元学习目标
- 理解${knowledge_point}的基本概念和原理
- 掌握${knowledge_point}的核心应用方法
- 能够在实际场景中运用${knowledge_point}解决问题

---

## 💡 核心概念解析
${knowledge_point}是${subject_domain}中的重要概念，它主要包含以下内容...

### ⚙️ 概念架构
根据您${learning_style}的学习风格，我们通过以下方式组织内容...

### 🔑 关键要素
- 关键要素1：...
- 关键要素2：...
- 关键要素3：...

---

## 🌉 认知支架
为了帮助您更好理解这个概念...

### 📝 概念连接图
${knowledge_point}与您已知的概念有如下联系...

### 🧩 分步理解指南
1. 首先了解...
2. 然后掌握...
3. 最后应用...

---

## 🔍 情境应用与示例
以下是几个与您${motivation_type}学习动机相关的应用场景...

### 💼 实际应用场景
- 场景1：...
- 场景2：...

### 🔄 概念应用过程
应用${knowledge_point}的过程通常包括...

---

## ⚡ 深度拓展
对于有兴趣深入了解的学习者...

### 🤔 思维挑战
尝试思考以下问题：...

### 🔗 跨学科连接
${knowledge_point}在其他学科领域也有应用...

---

## 📊 学习评估
通过以下问题检测您的理解...

### ✅ 自我检测
1. 问题1：...
2. 问题2：...
3. 问题3：...

### 🧪 应用挑战
尝试解决以下实际问题：...

---

## 📌 学习资源
为帮助您进一步学习，推荐以下资源...

### 📖 核心资源
- 资源1：...
- 资源2：...

### 🌱 延伸资源
- 延伸资源1：...
- 延伸资源2：...

---

## 🗺️ 后续学习路径
掌握${knowledge_point}后，建议您继续学习...

> 注：由于AI服务临时不可用，本内容为系统自动生成的备用版本，包含基本框架但细节较少。`;
}

/**
 * 生成模拟内容（开发环境使用）
 */
function generateMockContent(data) {
  const { knowledge_point, subject_domain, cognitive_level, learning_style, motivation_type, concept_type, complexity_level, learning_objective } = data;
  
  return `# ${knowledge_point} 个性化学习指南

## 📚 学习路径导航
> 欢迎开始探索${subject_domain}中关于${knowledge_point}的学习旅程！这份指南专为${cognitive_level}学习者设计，采用${learning_style}学习方式，针对您${motivation_type}的学习动机精心打造。

### 🎯 本单元学习目标
- 全面理解${knowledge_point}的核心概念和基本原理
- 掌握在${subject_domain}中应用${knowledge_point}的关键技能
- 能够分析实际问题并运用${knowledge_point}解决
- 评估不同情境下${knowledge_point}应用的适用性和局限性
- 创造性地将${knowledge_point}应用于新场景

---

## 💡 核心概念解析
${knowledge_point}是${subject_domain}中的${concept_type}知识，复杂度为${complexity_level}/5。它是连接${data.prerequisite_concepts || "基础概念"}与高级应用的重要桥梁。

${knowledge_point}的核心在于理解其内部结构和运作机制，这将使您能够灵活应用于各种情境。作为${cognitive_level}学习者，您需要将其与已有知识建立联系，形成知识网络。

### ⚙️ 概念架构
${learning_style === "视觉型" ? 
  "以下是${knowledge_point}的视觉概念图，展示了主要组成部分及其关系：\n\n[概念图位置]\n\n注意观察各元素间的连接方式和层级关系。" 
: learning_style === "文本型" ? 
  "以下是${knowledge_point}的结构化文本概述：\n\n1. 基础定义\n   - 核心特征\n   - 范围边界\n2. 组成要素\n   - 主要部分\n   - 辅助部分\n3. 运作机制\n   - 内部关系\n   - 外部联系" 
: learning_style === "应用型" ? 
  "通过以下实际案例，我们可以拆解${knowledge_point}的核心机制：\n\n[案例描述]\n\n请尝试识别这个案例中${knowledge_point}的各个组成部分。" 
: "让我们通过小组讨论形式来理解${knowledge_point}：\n\n假设您需要向一位完全不了解这个概念的同学解释，您会如何组织您的解释？"}

### 🔑 关键要素
- **核心原理**：${knowledge_point}的基础建立在[原理描述]之上，这是理解整个概念的关键。
- **应用条件**：在[具体条件]下，${knowledge_point}才能有效发挥作用，这一点对于${learning_objective}学习目标至关重要。
- **限制因素**：需要注意${knowledge_point}在[具体情境]下的局限性，避免错误应用。
- **发展脉络**：了解${knowledge_point}在${subject_domain}中的历史发展，有助于深入理解其重要性。

---

## 🌉 认知支架
为了帮助您更好地掌握${knowledge_point}，我们将其与您已知的概念建立连接，并提供分步理解路径。

### 📝 概念连接图
${knowledge_point}与以下概念密切相关：
- **前置知识**：${data.prerequisite_concepts || "基础概念"} → 提供了理解${knowledge_point}的必要基础
- **平行知识**：[相关概念] → 与${knowledge_point}处于同一层级，互为补充
- **后续知识**：[进阶概念] → 建立在${knowledge_point}之上的更高级概念

### 🧩 分步理解指南
针对您${cognitive_level}的认知水平，我们将${knowledge_point}分解为以下学习步骤：

1. **基础认知**：首先理解${knowledge_point}的基本定义和核心特征
2. **结构分析**：拆解${knowledge_point}的组成部分，明确各部分功能
3. **关系辨识**：掌握各组成部分之间的内在联系和相互作用
4. **情境应用**：学习在不同场景中识别和应用${knowledge_point}
5. **整合提升**：将${knowledge_point}与更广泛的知识体系连接，形成知识网络

---

## 🔍 情境应用与示例
以下是几个与您${motivation_type}学习动机相关的应用场景，帮助您将理论知识转化为实践能力。

### 💼 实际应用场景
${motivation_type === "任务导向" ?
  "- **职业场景**：[详细描述职业环境中应用${knowledge_point}解决实际问题的案例]\n- **项目应用**：[描述如何在项目中应用${knowledge_point}提高效率或质量]" 
: motivation_type === "兴趣驱动" ?
  "- **探索案例**：[描述一个有趣的${knowledge_point}应用案例，突出其中令人着迷的细节]\n- **创意应用**：[展示${knowledge_point}在创新领域的应用，激发学习兴趣]" 
: motivation_type === "成就导向" ?
  "- **挑战案例**：[描述一个需要熟练掌握${knowledge_point}才能解决的高难度问题]\n- **竞赛应用**：[展示${knowledge_point}在竞争环境中的应用价值]" 
: "- **实用案例**：[描述${knowledge_point}在日常生活或工作中的直接应用案例]\n- **问题解决**：[展示如何利用${knowledge_point}高效解决常见问题]"}

### 🔄 概念应用过程
${concept_type === "程序型" ?
  "应用${knowledge_point}的详细步骤如下：\n\n1. [第一步详细描述]\n2. [第二步详细描述]\n3. [第三步详细描述]\n4. [第四步详细描述]\n\n按照这个流程，您可以在不同情境中正确应用${knowledge_point}。" 
: concept_type === "概念型" ?
  "应用${knowledge_point}的思维过程如下：\n\n1. **识别情境**：确定当前问题是否适合应用${knowledge_point}\n2. **分析条件**：评估现有条件是否满足应用要求\n3. **选择策略**：根据具体情况选择最适合的应用方法\n4. **实施应用**：按照选定的策略应用${knowledge_point}\n5. **评估效果**：检验应用结果是否达到预期目标" 
: concept_type === "事实型" ?
  "在实际情境中应用${knowledge_point}相关事实的过程：\n\n1. **事实回忆**：准确提取关于${knowledge_point}的关键事实\n2. **情境匹配**：判断哪些事实与当前情境相关\n3. **应用判断**：基于相关事实做出合理判断或决策" 
: "应用${knowledge_point}原理的基本流程：\n\n1. **识别现象**：观察现象是否符合${knowledge_point}的适用范围\n2. **应用原理**：根据${knowledge_point}预测或解释现象\n3. **验证结果**：检验应用结果是否符合原理预期"}

---

## ⚡ 深度拓展
对于希望进一步探索${knowledge_point}的学习者，以下内容将带您进入更深层次的理解。

### 🤔 思维挑战
${complexity_level >= 4 ?
  "- **高阶问题**：[提出一个需要综合运用${knowledge_point}和其他相关知识才能解决的复杂问题]\n- **边界探索**：[探讨${knowledge_point}适用范围的边界情况和例外]" 
: complexity_level >= 2 ?
  "- **应用变式**：[提出${knowledge_point}在非标准情境中的应用问题]\n- **方案比较**：[比较使用不同方法解决同一问题的优劣]" 
: "- **基础拓展**：[提出一个稍微超出基本应用范围的问题]\n- **情境变化**：[探讨在条件变化时如何调整应用方法]"}

### 🔗 跨学科连接
${knowledge_point}在其他领域也有广泛应用：
- **在[相关学科1]中**：${knowledge_point}被用于[具体应用描述]
- **在[相关学科2]中**：${knowledge_point}的变体形式用于解决[具体问题描述]
- **未来发展**：${knowledge_point}在[新兴领域]有潜在的应用价值，如[具体发展方向]

---

## 📊 学习评估
通过以下评估活动检测您对${knowledge_point}的掌握程度。

### ✅ 自我检测
${learning_objective === "记忆" ?
  "1. [基础记忆题]\n2. [术语匹配题]\n3. [定义复述题]\n4. [简单应用题]" 
: learning_objective === "理解" ?
  "1. [概念解释题]\n2. [案例分析题]\n3. [关系判断题]\n4. [简单问题解决题]" 
: learning_objective === "应用" ?
  "1. [实际应用题]\n2. [情境分析题]\n3. [方法选择题]\n4. [程序执行题]" 
: learning_objective === "分析" ?
  "1. [分解分析题]\n2. [关联识别题]\n3. [原因分析题]\n4. [对比评价题]" 
: learning_objective === "评估" ?
  "1. [方案评估题]\n2. [批判思考题]\n3. [验证判断题]\n4. [标准应用题]" 
: "1. [创新设计题]\n2. [问题重构题]\n3. [方案创新题]\n4. [整合应用题]"}

### 🧪 应用挑战
${complexity_level >= 4 ?
  "尝试解决这个复杂的实际问题：\n\n[描述一个需要综合运用${knowledge_point}相关知识才能解决的复杂现实问题]" 
: complexity_level >= 2 ?
  "尝试解决这个中等难度的问题：\n\n[描述一个需要灵活应用${knowledge_point}的中等难度问题]" 
: "尝试解决这个基础应用问题：\n\n[描述一个直接应用${knowledge_point}就能解决的基础问题]"}

---

## 📌 学习资源
为帮助您进一步学习${knowledge_point}，推荐以下精选资源。

### 📖 核心资源
- **[经典教材/文章标题]**：全面介绍${knowledge_point}的权威资源
- **[在线课程/视频标题]**：适合${learning_style}学习风格的多媒体资源

### 🌱 延伸资源
- **[进阶读物标题]**：深入探讨${knowledge_point}的高级内容
- **[实践指南标题]**：提供${knowledge_point}实际应用的详细指导
- **[社区/论坛链接]**：与其他学习者讨论和分享${knowledge_point}的学习经验

---

## 🗺️ 后续学习路径
掌握${knowledge_point}后，您可以继续探索以下相关方向：

1. **深化方向**：进一步学习[相关高级概念1]，加深对${knowledge_point}的理解
2. **拓展方向**：探索[相关平行概念]，扩展知识面
3. **应用方向**：学习如何在[特定领域]中专业应用${knowledge_point}
4. **研究方向**：了解${knowledge_point}的前沿研究动态和发展趋势

> 注：这是开发环境中的模拟内容，用于测试内容生成功能。在实际环境中，将由Claude API生成更加个性化的学习内容。`;
} 