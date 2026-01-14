/**
 * Supabase 客户端初始化
 * 用途：创建并导出 Supabase 客户端实例
 * 
 * 使用前需要配置环境变量：
 * - VITE_SUPABASE_URL: Supabase 项目 URL
 * - VITE_SUPABASE_ANON_KEY: Supabase 匿名公钥
 */

import { createClient } from '@supabase/supabase-js';

// 从环境变量读取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 验证配置是否存在
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Supabase 配置缺失！请在 .env.local 中配置以下环境变量：');
    console.error('VITE_SUPABASE_URL=你的项目URL');
    console.error('VITE_SUPABASE_ANON_KEY=你的公钥');
    throw new Error('Supabase 配置缺失，请检查环境变量');
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // 可选：配置认证选项
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// 导出类型辅助（用于 TypeScript）
export type SupabaseClient = typeof supabase;

// 辅助函数：检查连接
export const testConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('project_info').select('id').limit(1);
        if (error) {
            console.error('Supabase 连接测试失败:', error.message);
            return false;
        }
        console.log('✅ Supabase 连接成功');
        return true;
    } catch (err) {
        console.error('Supabase 连接异常:', err);
        return false;
    }
};
