-- ==========================================
-- 💀 第一步：暴力清空 (核弹级操作)
-- ==========================================

-- 删除触发器
drop trigger if exists on_auth_user_created on auth.users;

-- 删除函数
drop function if exists public.handle_new_user;

-- 删除表 (使用 CASCADE 级联删除，确保关联表一起被删)
drop table if exists public.assessment_records cascade;
drop table if exists public.learning_materials cascade;
drop table if exists public.quiz_records cascade;
drop table if exists public.profiles cascade;

-- ==========================================
-- 🏗️ 第二步：重建表结构
-- ==========================================

-- 1. 用户档案表
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  student_id text, -- 这里通常存邮箱或学号
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. 测验记录表
create table public.quiz_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  topic text,
  score int,
  max_score int,
  correct_count int,
  total_questions int,
  questions_detail jsonb, -- 存储题目的详细 JSON
  created_at timestamptz default now()
);

-- 3. 评估结果表
create table public.assessment_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  related_quiz_id uuid references public.quiz_records(id) on delete set null,
  cognitive_level text,
  learning_style text,
  knowledge_gaps jsonb,
  strengths jsonb,
  suggestions jsonb,
  full_report text,
  created_at timestamptz default now()
);

-- 4. 学习内容历史表
create table public.learning_materials (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  topic text not null,
  content text,
  params jsonb,
  created_at timestamptz default now()
);

-- ==========================================
-- 🔒 第三步：设置权限 (RLS)
-- ==========================================

-- 开启 RLS
alter table public.profiles enable row level security;
alter table public.quiz_records enable row level security;
alter table public.assessment_records enable row level security;
alter table public.learning_materials enable row level security;

-- 创建策略：允许用户对自己数据的完全控制 (CRUD)
-- Profiles
create policy "profiles_policy" on public.profiles for all using (auth.uid() = id);

-- Quiz Records
create policy "quiz_policy" on public.quiz_records for all using (auth.uid() = user_id);

-- Assessment Records
create policy "assessment_policy" on public.assessment_records for all using (auth.uid() = user_id);

-- Learning Materials
create policy "materials_policy" on public.learning_materials for all using (auth.uid() = user_id);

-- ==========================================
-- ⚙️ 第四步：自动同步账号 (触发器)
-- ==========================================

-- 创建函数：当有人注册时，自动往 profiles 插一行数据
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, student_id)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    new.email -- 默认把邮箱作为 student_id，你可以后续在前端修改
  );
  return new;
end;
$$;

-- 绑定触发器到 auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- 🩹 第五步：补救现有用户 (可选)
-- ==========================================

-- 如果你刚才没把 auth 里的用户删干净，这一步会把剩下的“孤儿”账号补录到 profiles
insert into public.profiles (id, student_id)
select id, email from auth.users
where id not in (select id from public.profiles);