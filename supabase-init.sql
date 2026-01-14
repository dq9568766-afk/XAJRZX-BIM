-- =====================================================
-- Supabase 数据库初始化脚本 (全量 & 幂等版)
-- 项目：金融岛 BIM 网站
-- 用途：创建所有数据表、存储桶及安全策略
-- 说明：此脚本包含 DROP 语句，可重复执行
-- =====================================================

-- ⚠️ WARNING: 清理旧策略 (防止重复创建报错)
DO $$ 
BEGIN
    -- 删除所有表上的所有策略
    EXECUTE 'DROP POLICY IF EXISTS "允许所有人读取项目信息" ON project_info';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有人读取亮点" ON highlights';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有人读取成效" ON achievements';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有人读取团队成员" ON team_members';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有人读取区位幻灯片" ON location_slides';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有人读取现场幻灯片" ON site_slides';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有人读取首页视频" ON hero_videos';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有人读取参建单位" ON participating_units';
    EXECUTE 'DROP POLICY IF EXISTS "允许读取AI配置" ON ai_config';
    
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_项目信息" ON project_info';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_亮点" ON highlights';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_成效" ON achievements';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_团队" ON team_members';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_区位" ON location_slides';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_现场" ON site_slides';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_视频" ON hero_videos';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_参建单位" ON participating_units';
    EXECUTE 'DROP POLICY IF EXISTS "允许所有写操作_AI配置" ON ai_config';
END $$;

-- =====================================================
-- 1. 数据表定义
-- =====================================================

-- 1. 项目信息表
CREATE TABLE IF NOT EXISTS project_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  location TEXT,
  bim_model_url TEXT,
  bim_overview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 亮点应用表
CREATE TABLE IF NOT EXISTS highlights (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  files JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  technical_specs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 成效表
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('award', 'publication', 'visit')),
  date TEXT,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 团队成员表
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  contact TEXT,
  avatar TEXT,
  parent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 区位幻灯片表
CREATE TABLE IF NOT EXISTS location_slides (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 现场幻灯片表
CREATE TABLE IF NOT EXISTS site_slides (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 首页视频表
CREATE TABLE IF NOT EXISTS hero_videos (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 参建单位表
CREATE TABLE IF NOT EXISTS participating_units (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AI 配置表
CREATE TABLE IF NOT EXISTS ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'custom',
  provider_name TEXT DEFAULT 'Gemini',
  api_key TEXT,
  base_url TEXT DEFAULT 'https://generativelanguage.googleapis.com/v1beta',
  model TEXT NOT NULL DEFAULT 'gemini-2.0-flash-exp',
  system_prompt TEXT DEFAULT '你是一个专业的BIM技术顾问',
  knowledge_base TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. Row Level Security (RLS) 策略
-- =====================================================

-- 启用 RLS
ALTER TABLE project_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE participating_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;

-- 创建策略 (读取权限 - 公开)
CREATE POLICY "允许所有人读取项目信息" ON project_info FOR SELECT USING (true);
CREATE POLICY "允许所有人读取亮点" ON highlights FOR SELECT USING (true);
CREATE POLICY "允许所有人读取成效" ON achievements FOR SELECT USING (true);
CREATE POLICY "允许所有人读取团队成员" ON team_members FOR SELECT USING (true);
CREATE POLICY "允许所有人读取区位幻灯片" ON location_slides FOR SELECT USING (true);
CREATE POLICY "允许所有人读取现场幻灯片" ON site_slides FOR SELECT USING (true);
CREATE POLICY "允许所有人读取首页视频" ON hero_videos FOR SELECT USING (true);
CREATE POLICY "允许所有人读取参建单位" ON participating_units FOR SELECT USING (true);
CREATE POLICY "允许读取AI配置" ON ai_config FOR SELECT USING (true);

-- 创建策略 (写入权限 - 此处暂设为公开，后续建议限制为 authenticated)
CREATE POLICY "允许所有写操作_项目信息" ON project_info FOR ALL USING (true);
CREATE POLICY "允许所有写操作_亮点" ON highlights FOR ALL USING (true);
CREATE POLICY "允许所有写操作_成效" ON achievements FOR ALL USING (true);
CREATE POLICY "允许所有写操作_团队" ON team_members FOR ALL USING (true);
CREATE POLICY "允许所有写操作_区位" ON location_slides FOR ALL USING (true);
CREATE POLICY "允许所有写操作_现场" ON site_slides FOR ALL USING (true);
CREATE POLICY "允许所有写操作_视频" ON hero_videos FOR ALL USING (true);
CREATE POLICY "允许所有写操作_参建单位" ON participating_units FOR ALL USING (true);
CREATE POLICY "允许所有写操作_AI配置" ON ai_config FOR ALL USING (true);

-- =====================================================
-- 3. 触发器：自动更新 updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_project_info_updated_at ON project_info;
CREATE TRIGGER update_project_info_updated_at BEFORE UPDATE ON project_info
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_highlights_updated_at ON highlights;
CREATE TRIGGER update_highlights_updated_at BEFORE UPDATE ON highlights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_config_updated_at ON ai_config;
CREATE TRIGGER update_ai_config_updated_at BEFORE UPDATE ON ai_config
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. Storage 存储桶配置
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;

-- 清理旧的存储策略 (防止重复报错)
DO $$ 
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Public Access images SELECT" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Access images INSERT" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Access images DELETE" ON storage.objects';
    
    EXECUTE 'DROP POLICY IF EXISTS "Public Access videos SELECT" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Access videos INSERT" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Access videos DELETE" ON storage.objects';
    
    EXECUTE 'DROP POLICY IF EXISTS "Public Access documents SELECT" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Access documents INSERT" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Access documents DELETE" ON storage.objects';
END $$;

-- images 存储桶策略
CREATE POLICY "Public Access images SELECT" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public Access images INSERT" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Access images DELETE" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- videos 存储桶策略
CREATE POLICY "Public Access videos SELECT" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Public Access videos INSERT" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');
CREATE POLICY "Public Access videos DELETE" ON storage.objects FOR DELETE USING (bucket_id = 'videos');

-- documents 存储桶策略
CREATE POLICY "Public Access documents SELECT" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Public Access documents INSERT" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Public Access documents DELETE" ON storage.objects FOR DELETE USING (bucket_id = 'documents');

-- =====================================================
-- 5. 初始化默认数据
-- =====================================================

INSERT INTO project_info (title, subtitle, location) 
SELECT '雄安金融岛BIM应用展示', '利用BIM技术实现项目全生命周期数字化管理', '河北省雄安新区'
WHERE NOT EXISTS (SELECT 1 FROM project_info);

INSERT INTO ai_config (provider, api_key, model)
SELECT 'gemini', '', 'gemini-2.0-flash-exp'
WHERE NOT EXISTS (SELECT 1 FROM ai_config);

-- =====================================================
-- 完成！
-- =====================================================
