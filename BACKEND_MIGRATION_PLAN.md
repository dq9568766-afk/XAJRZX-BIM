# Supabase 后端集成实施计划

## 📋 总览

将当前基于 `localStorage` 的纯前端应用升级为使用 **Supabase** 作为后端数据库的全栈应用。

---

## 🎯 目标

1. ✅ 数据持久化到云端（Supabase PostgreSQL）
2. ✅ 多设备、多用户数据同步
3. ✅ 保持现有前端功能不变
4. ✅ 添加用户认证（可选）

---

## 📊 数据表设计 (Supabase Tables)

### 1. `project_info` (项目信息)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 主键 |
| title | text | 项目标题 |
| subtitle | text | 副标题 |
| location | text | 地理位置 |
| bim_model_url | text | BIM 模型链接 |
| bim_overview | text | BIM 应用概述 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### 2. `highlights` (亮点应用)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | 主键 |
| title | text | 标题 |
| summary | text | 摘要 |
| full_description | text | 详细描述 |
| thumbnail | text | 缩略图 (base64/URL) |
| images | jsonb | 图片数组 |
| files | jsonb | 文件列表 |
| video_url | text | 视频链接 |
| technical_specs | jsonb | 技术指标 |
| created_at | timestamp | 创建时间 |

### 3. `achievements` (成效)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | 主键 |
| title | text | 标题 |
| type | text | 类型 (award/publication/visit) |
| date | text | 日期 |
| description | text | 描述 |
| image_url | text | 图片 |
| created_at | timestamp | 创建时间 |

### 4. `team_members` (团队成员)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | 主键 |
| name | text | 姓名 |
| role | text | 职位 |
| contact | text | 联系方式 |
| avatar | text | 头像 |
| parent_id | text | 上级 ID |
| created_at | timestamp | 创建时间 |

### 5. `location_slides` (区位幻灯片)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int (PK) | 主键 |
| title | text | 标题 |
| description | text | 描述 |
| icon_name | text | 图标名称 |
| image | text | 图片 |
| created_at | timestamp | 创建时间 |

### 6. `site_slides` (现场幻灯片)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int (PK) | 主键 |
| title | text | 标题 |
| tag | text | 标签 |
| desc | text | 描述 |
| image | text | 图片 |
| created_at | timestamp | 创建时间 |

### 7. `hero_videos` (首页视频)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | 主键 |
| url | text | 视频链接 |
| created_at | timestamp | 创建时间 |

### 8. `participating_units` (参建单位)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | 主键 |
| category | text | 类别 |
| name | text | 名称 |
| logo | text | Logo |
| created_at | timestamp | 创建时间 |

### 9. `ai_config` (AI 配置)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 主键 |
| provider | text | 服务商 |
| api_key | text | API Key (加密) |
| model | text | 模型名称 |
| created_at | timestamp | 创建时间 |

---

## 🛠️ 实施步骤

### 第一阶段：Supabase 配置 (15分钟)

1. **注册 Supabase 账号**
   - 访问 https://supabase.com
   - 创建新项目
   - 记录 `Project URL` 和 `anon public key`

2. **创建数据表**
   - 使用提供的 SQL 脚本一键创建所有表
   - 配置 Row Level Security (RLS) 策略

### 第二阶段：后端服务层 (30分钟)

创建以下文件：

```
src/
  services/
    supabaseClient.ts      # Supabase 客户端初始化
    dataService.ts         # 数据操作封装 (CRUD)
```

### 第三阶段：前端改造 (45分钟)

1. **安装依赖**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **修改 DataContext.tsx**
   - 移除 `localStorage` 调用
   - 替换为 `dataService` API 调用
   - 添加异步加载状态管理

3. **环境变量配置**
   创建 `.env.local`:
   ```
   VITE_SUPABASE_URL=你的项目URL
   VITE_SUPABASE_ANON_KEY=你的公开密钥
   ```

### 第四阶段：测试与部署 (20分钟)

1. 本地测试所有 CRUD 功能
2. 数据迁移（从 localStorage 导出并导入 Supabase）
3. 部署到生产环境

---

## 🔐 安全考虑

1. **Row Level Security (RLS)**
   - 默认禁止所有未授权访问
   - 仅允许管理员角色修改数据

2. **API Key 保护**
   - 使用环境变量存储
   - 永不提交到 Git

3. **敏感数据加密**
   - AI API Key 使用 Supabase 的加密字段

---

## 📦 下一步行动

1. [ ] 提供 Supabase 项目信息
2. [ ] 执行 SQL 建表脚本
3. [ ] 安装前端依赖
4. [ ] 替换 DataContext 逻辑
5. [ ] 测试并验证

---

**预计总耗时**: 约 2 小时
**难度等级**: ⭐⭐⭐ (中等)
