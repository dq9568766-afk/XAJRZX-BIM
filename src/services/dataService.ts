/**
 * 数据服务层 - Supabase 数据操作封装
 * 用途：提供所有数据的 CRUD 操作，替代原 localStorage 逻辑
 * 
 * NOTE: 所有返回的数据类型与原 types.ts 保持一致
 */

import { supabase } from './supabaseClient';
import type {
    Highlight,
    Achievement,
    TeamMember,
    LocationSlide,
    SiteSlide,
    HeroVideo,
    ParticipatingUnit,
    AIConfig
} from '../types';

// ============================================
// 1. 项目信息 (Project Info)
// ============================================

export const getProjectInfo = async () => {
    const { data, error } = await supabase
        .from('project_info')
        .select('*')
        .single(); // 只有一条记录

    if (error) throw new Error(`获取项目信息失败: ${error.message}`);

    // NOTE: 转换字段名 (数据库使用 snake_case, 前端使用 camelCase)
    return {
        title: data.title,
        subtitle: data.subtitle,
        location: data.location,
        bimModelUrl: data.bim_model_url,
        bimOverview: data.bim_overview
    };
};

export const updateProjectInfo = async (info: any) => {
    // 转换为数据库字段名
    const dbData = {
        title: info.title,
        subtitle: info.subtitle,
        location: info.location,
        bim_model_url: info.bimModelUrl,
        bim_overview: info.bimOverview
    };

    const { error } = await supabase
        .from('project_info')
        .upsert(dbData); // 如果存在则更新，不存在则插入

    if (error) throw new Error(`更新项目信息失败: ${error.message}`);
};

// ============================================
// 2. 亮点应用 (Highlights)
// ============================================

export const getHighlights = async (): Promise<Highlight[]> => {
    const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`获取亮点失败: ${error.message}`);

    return data.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        fullDescription: item.full_description,
        thumbnail: item.thumbnail,
        images: item.images || [],
        files: item.files || [],
        videoUrl: item.video_url,
        technicalSpecs: item.technical_specs
    }));
};

export const saveHighlight = async (item: Highlight) => {
    const dbData = {
        id: item.id,
        title: item.title,
        summary: item.summary,
        full_description: item.fullDescription,
        thumbnail: item.thumbnail,
        images: item.images,
        files: item.files,
        video_url: item.videoUrl,
        technical_specs: item.technicalSpecs
    };

    const { error } = await supabase
        .from('highlights')
        .upsert(dbData);

    if (error) throw new Error(`保存亮点失败: ${error.message}`);
};

export const deleteHighlight = async (id: string) => {
    const { error } = await supabase
        .from('highlights')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`删除亮点失败: ${error.message}`);
};

// ============================================
// 3. 成效 (Achievements)
// ============================================

export const getAchievements = async (): Promise<Achievement[]> => {
    const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`获取成效失败: ${error.message}`);

    return data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type as 'award' | 'publication' | 'visit',
        date: item.date,
        description: item.description,
        imageUrl: item.image_url
    }));
};

export const saveAchievement = async (item: Achievement) => {
    const dbData = {
        id: item.id,
        title: item.title,
        type: item.type,
        date: item.date,
        description: item.description,
        image_url: item.imageUrl
    };

    const { error } = await supabase
        .from('achievements')
        .upsert(dbData);

    if (error) throw new Error(`保存成效失败: ${error.message}`);
};

export const deleteAchievement = async (id: string) => {
    const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`删除成效失败: ${error.message}`);
};

// ============================================
// 4. 团队成员 (Team Members)
// ============================================

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw new Error(`获取团队成员失败: ${error.message}`);

    return data.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        contact: item.contact,
        avatar: item.avatar,
        parentId: item.parent_id
    }));
};

export const saveTeamMember = async (item: TeamMember) => {
    const dbData = {
        id: item.id,
        name: item.name,
        role: item.role,
        contact: item.contact,
        avatar: item.avatar,
        parent_id: item.parentId
    };

    const { error } = await supabase
        .from('team_members')
        .upsert(dbData);

    if (error) throw new Error(`保存团队成员失败: ${error.message}`);
};

export const deleteTeamMember = async (id: string) => {
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`删除团队成员失败: ${error.message}`);
};

// ============================================
// 5. 区位幻灯片 (Location Slides)
// ============================================

export const getLocationSlides = async (): Promise<LocationSlide[]> => {
    const { data, error } = await supabase
        .from('location_slides')
        .select('*')
        .order('id', { ascending: true });

    if (error) throw new Error(`获取区位幻灯片失败: ${error.message}`);

    return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        iconName: item.icon_name,
        image: item.image
    }));
};

export const saveLocationSlide = async (item: LocationSlide) => {
    const dbData = {
        id: item.id,
        title: item.title,
        description: item.description,
        icon_name: item.iconName,
        image: item.image
    };

    const { error } = await supabase
        .from('location_slides')
        .upsert(dbData);

    if (error) throw new Error(`保存区位幻灯片失败: ${error.message}`);
};

export const deleteLocationSlide = async (id: number) => {
    const { error } = await supabase
        .from('location_slides')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`删除区位幻灯片失败: ${error.message}`);
};

// ============================================
// 6. 现场幻灯片 (Site Slides)
// ============================================

export const getSiteSlides = async (): Promise<SiteSlide[]> => {
    const { data, error } = await supabase
        .from('site_slides')
        .select('*')
        .order('id', { ascending: true });

    if (error) throw new Error(`获取现场幻灯片失败: ${error.message}`);

    return data;
};

export const saveSiteSlide = async (item: SiteSlide) => {
    const { error } = await supabase
        .from('site_slides')
        .upsert(item);

    if (error) throw new Error(`保存现场幻灯片失败: ${error.message}`);
};

export const deleteSiteSlide = async (id: number) => {
    const { error } = await supabase
        .from('site_slides')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`删除现场幻灯片失败: ${error.message}`);
};

// ============================================
// 7. 首页视频 (Hero Videos)
// ============================================

export const getHeroVideos = async (): Promise<HeroVideo[]> => {
    const { data, error } = await supabase
        .from('hero_videos')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw new Error(`获取首页视频失败: ${error.message}`);

    return data;
};

export const saveHeroVideo = async (item: HeroVideo) => {
    const { error } = await supabase
        .from('hero_videos')
        .upsert(item);

    if (error) throw new Error(`保存首页视频失败: ${error.message}`);
};

export const deleteHeroVideo = async (id: string) => {
    const { error } = await supabase
        .from('hero_videos')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`删除首页视频失败: ${error.message}`);
};

// ============================================
// 8. 参建单位 (Participating Units)
// ============================================

export const getParticipatingUnits = async (): Promise<ParticipatingUnit[]> => {
    const { data, error } = await supabase
        .from('participating_units')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw new Error(`获取参建单位失败: ${error.message}`);

    return data;
};

export const saveParticipatingUnit = async (item: ParticipatingUnit) => {
    const { error } = await supabase
        .from('participating_units')
        .upsert(item);

    if (error) throw new Error(`保存参建单位失败: ${error.message}`);
};

// ============================================
// 9. AI 配置 (AI Config)
// ============================================

export const getAIConfig = async (): Promise<AIConfig> => {
    const { data, error } = await supabase
        .from('ai_config')
        .select('*')
        .single();

    if (error) {
        // 如果没有记录，返回默认值
        return {
            provider: 'gemini',
            apiKey: '',
            model: 'gemini-2.0-flash-exp'
        };
    }

    return {
        provider: data.provider,
        apiKey: data.api_key,
        model: data.model
    };
};

export const updateAIConfig = async (config: AIConfig) => {
    const dbData = {
        provider: config.provider,
        api_key: config.apiKey,
        model: config.model
    };

    const { error } = await supabase
        .from('ai_config')
        .upsert(dbData);

    if (error) throw new Error(`更新AI配置失败: ${error.message}`);
};

// ============================================
// 辅助函数
// ============================================

/**
 * 批量初始化数据 (用于首次迁移)
 */
export const batchImportData = async (dataType: string, items: any[]) => {
    const tableMap: Record<string, string> = {
        highlights: 'highlights',
        achievements: 'achievements',
        teamMembers: 'team_members',
        locationSlides: 'location_slides',
        siteSlides: 'site_slides',
        heroVideos: 'hero_videos',
        participatingUnits: 'participating_units'
    };

    const tableName = tableMap[dataType];
    if (!tableName) throw new Error(`未知的数据类型: ${dataType}`);

    const { error } = await supabase
        .from(tableName)
        .insert(items);

    if (error) throw new Error(`批量导入失败: ${error.message}`);
};
