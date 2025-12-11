// 学习资源库 - 从课程数据中提取
export const learningResources = [
  { title: '2024年Python零基础入门到精通教程', url: 'https://www.bilibili.com/video/BV1qW4y1a7fU', platform: 'B站', tags: ['Python', '零基础', '编程', '爬虫', '数据分析', '实战项目'] },
  { title: 'JavaScript高级程序设计与实战', url: 'https://www.bilibili.com/video/BV1Kt411w7MP', platform: 'B站', tags: ['JavaScript', 'ES6', 'Vue', 'React', '前端', '高级编程', '编程'] },
  { title: '机器学习基础与实战应用', url: 'https://www.bilibili.com/video/BV1Wv411h7kN', platform: 'B站', tags: ['机器学习', '深度学习', '神经网络', 'AI', 'TensorFlow', '人工智能', '编程'] },
  { title: '小学数学知识点大全', url: 'https://www.bilibili.com/video/BV1MG411h7ny/?spm_id_from=333.337.search-card.all.click', platform: 'B站', tags: ['小学', '数学', '小学数学'] },
  { title: 'React18+TypeScript企业级项目实战', url: 'https://www.bilibili.com/video/BV1ZB4y1Z7o8', platform: 'B站', tags: ['React', 'TypeScript', '前端', '企业项目', 'Hooks', '编程'] },
  { title: '数据结构与算法（C++版）', url: 'https://www.icourse163.org/course/THU-1002654005', platform: '中国大学MOOC', tags: ['数据结构', '算法', '编程', '计算机科学', 'C++', '清华', '编程'] },
  { title: '微积分（上）', url: 'https://www.icourse163.org/course/PKU-1002014005', platform: '中国大学MOOC', tags: ['微积分', '数学', '高等数学', '计算', '北大'] },
  { title: '大学物理（力学）', url: 'https://www.icourse163.org/course/PKU-1003645005', platform: '中国大学MOOC', tags: ['物理', '大学物理', '力学', '电磁学', '北大', '理论物理', '编程'] },
  { title: '深度学习与PyTorch实战', url: 'https://www.bilibili.com/video/BV1hE411t7RN', platform: 'B站', tags: ['深度学习', 'PyTorch', '神经网络', 'CV', '计算机视觉', '编程'] },
  { title: 'Node.js+Express+MongoDB全栈开发', url: 'https://www.bilibili.com/video/BV1a34y167AZ', platform: 'B站', tags: ['Node.js', 'Express', 'MongoDB', '全栈', '后端开发', '编程'] },
  { title: '高考数学强化课程', url: 'https://www.bilibili.com/video/BV1NE421w7rV/?spm_id_from=333.337.search-card.all.click', platform: 'B站', tags: ['高考数学', '高中数学', '数学', '理科', '刷题', '应试'] },
  { title: '大学高等数学/微积分全程', url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/?spm_id_from=333.337.search-card.all.click', platform: 'B站', tags: ['大学数学', '高等数学', '微积分', '数学', '理工'] },
  { title: '中考英语语法精讲', url: 'https://www.bilibili.com/video/BV1coC5BXE52/?spm_id_from=333.337.search-card.all.click', platform: 'B站', tags: ['中考英语', '英语语法', '初中英语', '语法', '英语'] },
  { title: '大学英语四六级备考', url: 'https://www.bilibili.com/video/BV1uqMczxEJw/?spm_id_from=333.337.search-card.all.click', platform: 'B站', tags: ['英语', '四六级', '大学英语', '英语听力', '英语阅读'] },
];

// 关键词匹配函数
export function matchLearningResources(knowledgePoint, subjectDomain, maxResults = 3) {
  const keywords = extractKeywords(knowledgePoint, subjectDomain);
  const scored = learningResources.map(resource => {
    const score = calculateMatchScore(keywords, resource);
    return { ...resource, score };
  });
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .filter(item => item.score > 0);
}

// 提取关键词
function extractKeywords(knowledgePoint, subjectDomain) {
  const keywords = [];
  if (knowledgePoint) keywords.push(...knowledgePoint.split(/[，,、\s]+/));
  if (subjectDomain) keywords.push(...subjectDomain.split(/[，,、\s]+/));
  return keywords.filter(k => k.length > 1);
}

// 计算匹配分数
function calculateMatchScore(keywords, resource) {
  let score = 0;
  const resourceText = `${resource.title} ${resource.tags.join(' ')}`.toLowerCase();
  
  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (resource.title.toLowerCase().includes(lowerKeyword)) score += 3;
    if (resource.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))) score += 2;
    if (resourceText.includes(lowerKeyword)) score += 1;
  });
  
  return score;
}

