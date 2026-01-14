/**
 * Supabase 客户端初始化
 * 用途：创建并导出 Supabase 客户端实例
 * 
 * 使用前需要配置环境变量：
 * - VITE_SUPABASE_URL: Supabase 项目 URL
 * - VITE_SUPABASE_ANON_KEY: Supabase 匿名公钥
 */

import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

// 从环境变量读取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 标记是否已配置 Supabase
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// 创建 Supabase 客户端（如果未配置则创建一个空壳）
export const supabase: SupabaseClientType = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    })
    : createClient('https://placeholder.supabase.co', 'placeholder-key'); // 占位客户端

// 辅助函数：检查连接
export const testConnection = async (): Promise<boolean> => {
    if (!isSupabaseConfigured) {
        console.warn('⚠️ Supabase 未配置，使用本地存储模式');
        return false;
    }

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

// 初始化检查
if (!isSupabaseConfigured) {
    console.info('📌 Supabase 未配置，将使用本地存储 (localStorage) 作为数据源');
    console.info('📌 配置方法：在 .env.local 文件中添加 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
}
