import { NextResponse } from 'next/server';

// 从环境变量获取API配置
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.FASTGPT_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL || process.env.FASTGPT_API_URL || 'https://api.fastgpt.io/api/v1/chat/completions';
const BACKUP_API_URL = 'https://globalai.vip/v1/messages'; // 尝试标准Claude API格式
const API_TIMEOUT = 30000; // 设置30秒超时，避免504错误

// 强制使用真实API，禁用模拟数据
const USE_MOCK_API = false;

/**
 * 学习内容生成API
 */
export async function POST(request) {
  try {
    // 检查API配置
    if (!CLAUDE_API_KEY) {
      console.error('API密钥未配置');
      return NextResponse.json(
        { error: 'API服务未配置，请联系管理员' },
        { status: 500 }
      );
    }

    // 解析请求体
    const requestData = await request.json();
    
    console.log('接收到内容生成请求:', {
      knowledge_point: requestData.knowledge_point,
      subject_domain: requestData.subject_domain,
      cognitive_level: requestData.cognitive_level
    });
    
    // 构建完整的系统提示词，包含所有参数信息
    const systemPrompt = buildSystemPrompt(requestData);
    
    // 使用简单的用户提示词，因为详细信息已经在系统提示词中
    const userPrompt = `请根据我的认知水平(${requestData.cognitive_level})、学习风格(${requestData.learning_style})、先验知识(${requestData.prior_knowledge || '中等'})和学习动机(${requestData.motivation_type})，为我生成一份关于"${requestData.knowledge_point}"的个性化学习指南。${requestData.learning_style === '视觉型' ? '请务必包含至少2-3个符合规范的流程图、思维导图或示意图，用于可视化表达重要概念和关系。' : ''}`;
    
    // 尝试API调用
    try {
      console.log('正在调用AI API...');
      const apiResponse = await callClaudeAPI(CLAUDE_API_URL, systemPrompt, userPrompt);
      
      return NextResponse.json({ 
        success: true,
        content: apiResponse.trim()
      });
    } catch (apiError) {
      console.error('API调用失败:', apiError.message);
      
      // 不使用备用内容，直接返回错误
      return NextResponse.json(
        { 
          error: `AI服务暂时不可用：${apiError.message}。请稍后再试。`,
          details: 'API调用失败'
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('内容生成API错误:', error);
    return NextResponse.json(
      { error: `请求处理失败: ${error.message}` },
      { status: 400 }
    );
  }
}

/**
 * 构建系统提示词
 */
function buildSystemPrompt(data) {
  return `您是"EduSage"，一个专业的自适应教育内容生成系统。您的任务是根据详细的学习者模型和知识点特征，生成精确校准的个性化教学内容。

重要说明：您收到的用户消息中已包含关键的学习者信息和知识点数据。您必须根据这些信息生成一份完整的、高度个性化的学习内容，而不是询问更多信息。

## 学习者模型说明
- 认知维度: 这表示学习者的思维水平（初级/中级/高级）
- 先验知识: 这表示学习者已有的相关知识基础（基础/中等/深入）
- 学习风格: 这表示学习者偏好的学习方式（视觉型/文本型/应用型/社交型）
- 学习动机: 这表示学习者的主要学习动力（任务导向/兴趣驱动/成就导向/应用导向）

## 知识点特征说明
- 知识点: 需要学习的具体概念或技能
- 学科领域: 知识点所属的学科
- 概念类型: 知识的性质（事实型/程序型/概念型/原理型）
- 复杂度级别: 知识点的难度和复杂性（1-5级）
- 学习目标: 期望达到的认知层次（记忆/理解/应用/分析/评估/创造）

## 您的任务
根据用户提供的这些信息，生成一份高度适配的学习内容。内容必须：
1. 符合学习者的认知水平和先验知识
2. 采用学习者偏好的学习风格
3. 激发学习者的学习动机
4. 呈现适合知识点复杂度的内容
5. 帮助学习者达成学习目标

## 图表与可视化注意事项
当学习者是视觉型时，应当增加图表和视觉元素。如要插入流程图、思维导图等，请使用以下格式：

\`\`\`
graph TD
A[开始] --> B[步骤1]
B --> C[步骤2]
C --> D[结束]
\`\`\`

或使用单反引号的简化格式:

\`graph TD
A[开始] --> B[步骤1]
B --> C[步骤2]
C --> D[结束]\`

请注意：不要使用\`\`mermaid或类似标记，只需使用常规的代码块或行内代码标记。

## 输出结构规范
您必须严格按照以下结构生成内容：

# {知识点} 个性化学习指南

## 📚 学习路径导航
> {根据学习者模型定制的简短介绍，强调该知识点对学习者的相关性和价值}

### 🎯 本单元学习目标
{列出3-5个基于学习目标的具体学习目标，根据认知水平调整}

---

## 💡 核心概念解析
{根据认知水平和先验知识调整的概念解释}

### ⚙️ 概念架构
{针对学习风格设计的概念组织方式}

### 🔑 关键要素
{3-5个根据复杂度级别调整的要点，每个配有针对学习风格的说明}

---

## 🌉 认知支架
{根据先验知识设计的支架内容}

### 📝 概念连接图
{将新知识点与已知概念的连接，采用适合的表征方式}

### 🧩 分步理解指南
{将复杂概念分解为更小、更易消化的部分}

---

## 🔍 情境应用与示例
{根据学习风格和动机类型选择的示例}

### 💼 实际应用场景
{2-4个与学习者相关的应用场景，复杂度随认知水平递增}

### 🔄 概念应用过程
{针对概念类型的应用流程或思维过程}

---

## ⚡ 深度拓展
{基于认知水平和动机类型的拓展内容}

### 🤔 思维挑战
{与知识点相关的开放性问题或情境，难度随认知水平调整}

### 🔗 跨学科连接
{将知识点与其他领域或更广泛背景的联系}

---

## 📊 学习评估
{根据认知水平和学习目标设计的评估活动}

### ✅ 自我检测
{3-5个自评问题，从简单到复杂}

### 🧪 应用挑战
{1-2个需要综合应用所学知识的任务或问题}

---

## 📌 学习资源
{根据学习风格和动机类型推荐的资源}

### 📖 核心资源
{2-3个与知识点直接相关的资源}

### 🌱 延伸资源
{2-3个可进一步探索的资源}

---

## 🗺️ 后续学习路径
{基于当前知识点的后续学习建议}

请注意：您必须生成一份完整的内容，填充每个部分的具体内容，而不是简单重复模板。每个部分都应该有实质性内容，而不仅仅是说明或占位符。`;
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
 * 调用Claude API
 */
async function callClaudeAPI(apiUrl, systemPrompt, userPrompt) {
  try {
    console.log(`调用Claude API (${apiUrl})...`);
    
    // 使用AbortController设置超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    // 使用简单稳定的模型
    const selectedModel = 'claude-3-5-sonnet-20241022';
    
    // 打印系统提示词的一部分
    console.log('系统提示词片段:', systemPrompt.substring(0, 200) + '...');
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
      max_tokens: 4000
    };
    
    console.log(`使用模型: ${selectedModel}`);
    
    // 添加必要的请求头
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${CLAUDE_API_KEY}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'Host': 'globalai.vip',
      'Connection': 'keep-alive'
    };
    
    // 确认请求格式
    console.log('请求体结构:', Object.keys(requestBody));
    console.log('请求头:', Object.keys(headers));
    
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
    console.log('原始响应文本:', responseText.substring(0, 200) + '...');
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      console.error('收到的文本:', responseText);
      
      // 如果不是JSON格式，但是看起来像是文本内容，就直接返回
      if (responseText && responseText.length > 50 && !responseText.startsWith('<')) {
        console.log('响应不是JSON，但可能是文本内容，直接返回');
        return responseText;
      }
      
      throw new Error(`无法解析API响应: ${parseError.message}`);
    }
    
    console.log('Claude API响应结构:', Object.keys(data));
    console.log('响应数据样本:', JSON.stringify(data).substring(0, 300) + '...');
    
    // 尝试从各种可能的响应格式中提取内容
    const textContent = extractContentFromResponse(data);
    
    if (!textContent) {
      console.error('无法从响应中提取文本内容:', JSON.stringify(data));
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