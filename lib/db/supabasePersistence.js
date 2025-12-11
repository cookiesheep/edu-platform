import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// 支持两种命名：NEXT_PUBLIC_SUPABASE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 调试日志：检查环境变量
console.log('[supabasePersistence] 环境变量检查:', {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!anonKey,
  hasServiceRoleKey: !!serviceRoleKey,
  serviceRoleKeyLength: serviceRoleKey ? serviceRoleKey.length : 0,
  serviceRoleKeyPrefix: serviceRoleKey ? serviceRoleKey.substring(0, 20) + '...' : 'none'
});

function hasSupabaseConfig() {
  const ok = !!supabaseUrl && !!(serviceRoleKey || anonKey);
  if (!ok) {
    console.warn('[supabasePersistence] 缺少配置，跳过写库', {
      hasUrl: !!supabaseUrl,
      hasService: !!serviceRoleKey,
      hasAnon: !!anonKey,
    });
  }
  return ok;
}

async function getServerClient(customClient = null) {
  // 调试：检查serviceRoleKey是否可用
  const hasServiceKey = !!serviceRoleKey && serviceRoleKey.trim().length > 0;
  
  console.log('[supabasePersistence] getServerClient 调用:', {
    hasServiceKey,
    serviceRoleKeyLength: serviceRoleKey ? serviceRoleKey.length : 0,
    hasCustomClient: !!customClient,
    serviceRoleKeyPrefix: serviceRoleKey ? serviceRoleKey.substring(0, 30) + '...' : 'none'
  });
  
  // 如果有service role key，优先使用它（可以绕过RLS）
  if (hasServiceKey) {
    console.log('[supabasePersistence] ✅ 使用 service role key（绕过RLS）');
    const client = createSupabaseClient(supabaseUrl, serviceRoleKey);
    // 验证客户端创建成功
    console.log('[supabasePersistence] Service role 客户端创建成功');
    return client;
  }
  
  console.warn('[supabasePersistence] ⚠️ 未找到 service role key，尝试使用自定义客户端或 anon key');
  
  // 如果提供了自定义客户端，检查是否有有效的用户会话
  if (customClient) {
    try {
      const { data: { session }, error: sessionError } = await customClient.auth.getSession();
      if (session?.user?.id) {
        console.log('[supabasePersistence] 使用自定义客户端（带用户会话）');
        return customClient;
      } else {
        console.warn('[supabasePersistence] ⚠️ 自定义客户端无用户会话:', sessionError?.message || '无会话');
        // 即使没有用户会话，如果没有service role key，也只能使用这个客户端
        return customClient;
      }
    } catch (error) {
      console.warn('[supabasePersistence] 检查用户会话失败，使用自定义客户端:', error.message);
      return customClient;
    }
  }
  
  if (!hasSupabaseConfig()) {
    console.error('[supabasePersistence] ❌ 缺少Supabase配置');
    return null;
  }
  
  // 如果没有service role key，使用anon key（需要用户会话）
  console.warn('[supabasePersistence] ⚠️ 使用 anon key，需要用户会话才能通过RLS');
  return createSupabaseClient(supabaseUrl, anonKey);
}

/**
 * 保存测验记录到 Supabase.quiz_records
 * @param {Object} params - 参数对象
 * @param {string} params.userId - 用户ID
 * @param {string} params.topic - 主题
 * @param {Object} params.gradingResults - 批改结果
 * @param {Array} params.questionsDetail - 题目详情
 * @param {Object} [params.client] - 可选的Supabase客户端（带有用户会话）
 */
export async function insertQuizRecord({
  userId,
  topic,
  gradingResults,
  questionsDetail,
  client: customClient = null,
}) {
  if (!userId || !gradingResults) return null;
  const client = await getServerClient(customClient);
  if (!client) return null;

  const { data, error } = await client.from('quiz_records').insert({
    user_id: userId,
    topic: topic || gradingResults?.quiz_topic || null,
    score: gradingResults?.total_score ?? null,
    max_score: gradingResults?.max_score ?? null,
    correct_count: gradingResults?.question_details?.filter?.((q) => q.is_correct).length ?? null,
    total_questions: gradingResults?.question_details?.length ?? null,
    questions_detail: questionsDetail || gradingResults?.question_details || null,
  }).select();

  if (error) {
    console.error('[supabasePersistence] insertQuizRecord 失败', error);
    return null;
  } else {
    console.log('[supabasePersistence] insertQuizRecord 成功，记录ID:', data?.[0]?.id);
    return data?.[0] || null;
  }
}

/**
 * 保存评估结果到 Supabase.assessment_records
 * @param {Object} params - 参数对象
 * @param {string} params.userId - 用户ID
 * @param {string} [params.relatedQuizId] - 关联的测验记录ID
 * @param {Object} params.assessment - 评估结果
 * @param {Object} [params.client] - 可选的Supabase客户端（带有用户会话）
 */
export async function insertAssessmentRecord({
  userId,
  relatedQuizId = null,
  assessment,
  client: customClient = null,
}) {
  if (!userId || !assessment) return null;
  const client = await getServerClient(customClient);
  if (!client) return null;

  const structured = assessment.structured_data || {};
  
  // 从评估报告中提取学习风格（如果structured_data中没有）
  let learningStyle = structured.learning_patterns?.style || null;
  if (!learningStyle && assessment.report) {
    // 尝试从报告中提取学习风格
    const report = assessment.report.toLowerCase();
    if (report.includes('视觉型') || report.includes('视觉')) {
      learningStyle = '视觉型';
    } else if (report.includes('文本型') || report.includes('文本')) {
      learningStyle = '文本型';
    } else if (report.includes('应用型') || report.includes('应用')) {
      learningStyle = '应用型';
    } else if (report.includes('社交型') || report.includes('社交')) {
      learningStyle = '社交型';
    }
  }
  
  // 从认知评估中提取认知水平
  let cognitiveLevel = structured.cognitive_assessment?.level || null;
  if (cognitiveLevel === 'basic') {
    cognitiveLevel = '初级认知';
  } else if (cognitiveLevel === 'intermediate') {
    cognitiveLevel = '中级认知';
  } else if (cognitiveLevel === 'advanced') {
    cognitiveLevel = '高级认知';
  }
  
  const { data, error } = await client.from('assessment_records').insert({
    user_id: userId,
    related_quiz_id: relatedQuizId,
    cognitive_level: cognitiveLevel,
    learning_style: learningStyle,
    knowledge_gaps: structured.knowledge_gaps || null,
    strengths: structured.strengths || null,
    suggestions: structured.weaknesses || null,
    full_report: assessment.report || null,
  }).select();

  if (error) {
    console.error('[supabasePersistence] insertAssessmentRecord 失败', error);
    return null;
  } else {
    console.log('[supabasePersistence] insertAssessmentRecord 成功，记录ID:', data?.[0]?.id);
    return data?.[0] || null;
  }
}

/**
 * 保存生成的学习内容到 Supabase.learning_materials
 * @param {Object} params - 参数对象
 * @param {string} params.userId - 用户ID
 * @param {string} params.topic - 主题
 * @param {string} params.content - 内容
 * @param {Object} [params.params] - 参数
 * @param {Object} [params.client] - 可选的Supabase客户端（带有用户会话）
 */
export async function insertLearningMaterial({
  userId,
  topic,
  content,
  params,
  client: customClient = null,
}) {
  if (!userId || !topic || !content) return null;
  const client = await getServerClient(customClient);
  if (!client) return null;

  const { data, error } = await client.from('learning_materials').insert({
    user_id: userId,
    topic,
    content,
    params: params || null,
  }).select();

  if (error) {
    console.error('[supabasePersistence] insertLearningMaterial 失败', error);
    return null;
  } else {
    console.log('[supabasePersistence] insertLearningMaterial 成功，记录ID:', data?.[0]?.id);
    return data?.[0] || null;
  }
}

/**
 * 获取用户的测验记录历史
 */
export async function getQuizRecords({ userId, limit = 10 }) {
  if (!userId) return [];
  const client = await getServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from('quiz_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[supabasePersistence] getQuizRecords 失败', error);
    return [];
  }

  return data || [];
}

/**
 * 获取用户的评估记录历史
 */
export async function getAssessmentRecords({ userId, limit = 10 }) {
  if (!userId) return [];
  const client = await getServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from('assessment_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[supabasePersistence] getAssessmentRecords 失败', error);
    return [];
  }

  return data || [];
}

/**
 * 获取用户的学习内容历史
 */
export async function getLearningMaterials({ userId, limit = 10 }) {
  if (!userId) return [];
  const client = await getServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from('learning_materials')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[supabasePersistence] getLearningMaterials 失败', error);
    return [];
  }

  return data || [];
}

/**
 * 如果你需要基于前端会话而非服务密钥来插入（遵守 RLS），
 * 可以调用 supabase.auth.getSession() 并透传 session.access_token
 * 到 createClient 中。当前默认优先使用 service role 便于后端写入。
 */

