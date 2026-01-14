/**
 * 数据服务层 - 统一数据操作封装
 * 用途：提供所有数据的 CRUD 操作
 * 
 * 设计原则：
 * - 如果 Supabase 已配置，使用云端数据库
 * - 如果未配置，降级使用 localStorage（兼容现有逻辑）
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
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
// 辅助函数：localStorage 操作
// ============================================

const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const saveToLocalStorage = <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
};

// ============================================
// 1. 项目信息 (Project Info)
// ============================================

export const getProjectInfo = async () => {
    if (!isSupabaseConfigured) {
        return getFromLocalStorage('projectInfo', {
            title: '雄安金融岛BIM应用展示',
            subtitle: '利用BIM技术实现项目全生命周期数字化管理',
            location: '河北省雄安新区',
            bimModelUrl: '',
            bimOverview: ''
        });
    }

    const { data, error } = await supabase
        .from('project_info')
        .select('*')
        .single();

    if (error) throw new Error(`获取项目信息失败: ${error.message}`);

    return {
        title: data.title,
        subtitle: data.subtitle,
        location: data.location,
        bimModelUrl: data.bim_model_url,
        bimOverview: data.bim_overview
    };
};

export const updateProjectInfo = async (info: any) => {
    if (!isSupabaseConfigured) {
        saveToLocalStorage('projectInfo', info);
        return;
    }

    const dbData = {
        title: info.title,
        subtitle: info.subtitle,
        location: info.location,
        bim_model_url: info.bimModelUrl,
        bim_overview: info.bimOverview
    };

    const { error } = await supabase
        .from('project_info')
        .upsert(dbData);

    if (error) throw new Error(`更新项目信息失败: ${error.message}`);
};

// ============================================
// 2. 亮点应用 (Highlights)
// ============================================

export const getHighlights = async (): Promise<Highlight[]> => {
    if (!isSupabaseConfigured) {
        return getFromLocalStorage<Highlight[]>('highlights', []);
    }

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
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<Highlight[]>('highlights', []);
        const exists = list.findIndex(i => i.id === item.id);
        if (exists >= 0) {
            list[exists] = item;
        } else {
            list.push(item);
        }
        saveToLocalStorage('highlights', list);
        return;
    }

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

    const { error } = await supabase.from('highlights').upsert(dbData);
    if (error) throw new Error(`保存亮点失败: ${error.message}`);
};

export const deleteHighlight = async (id: string) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<Highlight[]>('highlights', []);
        saveToLocalStorage('highlights', list.filter(i => i.id !== id));
        return;
    }

    const { error } = await supabase.from('highlights').delete().eq('id', id);
    if (error) throw new Error(`删除亮点失败: ${error.message}`);
};

// ============================================
// 3. 成效 (Achievements)
// ============================================

export const getAchievements = async (): Promise<Achievement[]> => {
    if (!isSupabaseConfigured) {
        return getFromLocalStorage<Achievement[]>('achievements', []);
    }

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
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<Achievement[]>('achievements', []);
        const exists = list.findIndex(i => i.id === item.id);
        if (exists >= 0) {
            list[exists] = item;
        } else {
            list.push(item);
        }
        saveToLocalStorage('achievements', list);
        return;
    }

    const dbData = {
        id: item.id,
        title: item.title,
        type: item.type,
        date: item.date,
        description: item.description,
        image_url: item.imageUrl
    };

    const { error } = await supabase.from('achievements').upsert(dbData);
    if (error) throw new Error(`保存成效失败: ${error.message}`);
};

export const deleteAchievement = async (id: string) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<Achievement[]>('achievements', []);
        saveToLocalStorage('achievements', list.filter(i => i.id !== id));
        return;
    }

    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) throw new Error(`删除成效失败: ${error.message}`);
};

// ============================================
// 4. 团队成员 (Team Members)
// ============================================

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    if (!isSupabaseConfigured) {
        return getFromLocalStorage<TeamMember[]>('teamMembers', []);
    }

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
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<TeamMember[]>('teamMembers', []);
        const exists = list.findIndex(i => i.id === item.id);
        if (exists >= 0) {
            list[exists] = item;
        } else {
            list.push(item);
        }
        saveToLocalStorage('teamMembers', list);
        return;
    }

    const dbData = {
        id: item.id,
        name: item.name,
        role: item.role,
        contact: item.contact,
        avatar: item.avatar,
        parent_id: item.parentId
    };

    const { error } = await supabase.from('team_members').upsert(dbData);
    if (error) throw new Error(`保存团队成员失败: ${error.message}`);
};

export const deleteTeamMember = async (id: string) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<TeamMember[]>('teamMembers', []);
        saveToLocalStorage('teamMembers', list.filter(i => i.id !== id));
        return;
    }

    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw new Error(`删除团队成员失败: ${error.message}`);
};

// ============================================
// 5. 区位幻灯片 (Location Slides)
// ============================================

export const getLocationSlides = async (): Promise<LocationSlide[]> => {
    if (!isSupabaseConfigured) {
        return getFromLocalStorage<LocationSlide[]>('locationSlides', []);
    }

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
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<LocationSlide[]>('locationSlides', []);
        const exists = list.findIndex(i => i.id === item.id);
        if (exists >= 0) {
            list[exists] = item;
        } else {
            list.push(item);
        }
        saveToLocalStorage('locationSlides', list);
        return;
    }

    const dbData = {
        id: item.id,
        title: item.title,
        description: item.description,
        icon_name: item.iconName,
        image: item.image
    };

    const { error } = await supabase.from('location_slides').upsert(dbData);
    if (error) throw new Error(`保存区位幻灯片失败: ${error.message}`);
};

export const deleteLocationSlide = async (id: number) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<LocationSlide[]>('locationSlides', []);
        saveToLocalStorage('locationSlides', list.filter(i => i.id !== id));
        return;
    }

    const { error } = await supabase.from('location_slides').delete().eq('id', id);
    if (error) throw new Error(`删除区位幻灯片失败: ${error.message}`);
};

// ============================================
// 6. 现场幻灯片 (Site Slides)
// ============================================

export const getSiteSlides = async (): Promise<SiteSlide[]> => {
    if (!isSupabaseConfigured) {
        return getFromLocalStorage<SiteSlide[]>('siteSlides', []);
    }

    const { data, error } = await supabase
        .from('site_slides')
        .select('*')
        .order('id', { ascending: true });

    if (error) throw new Error(`获取现场幻灯片失败: ${error.message}`);

    // 映射数据库字段 description 到前端字段 desc
    return data.map(item => ({
        id: item.id,
        image: item.image,
        tag: item.tag,
        title: item.title,
        desc: item.description // 数据库用 description，前端用 desc
    }));
};

export const saveSiteSlide = async (item: SiteSlide) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<SiteSlide[]>('siteSlides', []);
        const exists = list.findIndex(i => i.id === item.id);
        if (exists >= 0) {
            list[exists] = item;
        } else {
            list.push(item);
        }
        saveToLocalStorage('siteSlides', list);
        return;
    }

    // 映射前端字段 desc 到数据库字段 description
    const dbData = {
        id: item.id,
        image: item.image,
        tag: item.tag,
        title: item.title,
        description: item.desc // 前端用 desc，数据库用 description
    };

    const { error } = await supabase.from('site_slides').upsert(dbData);
    if (error) throw new Error(`保存现场幻灯片失败: ${error.message}`);
};

export const deleteSiteSlide = async (id: number) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<SiteSlide[]>('siteSlides', []);
        saveToLocalStorage('siteSlides', list.filter(i => i.id !== id));
        return;
    }

    const { error } = await supabase.from('site_slides').delete().eq('id', id);
    if (error) throw new Error(`删除现场幻灯片失败: ${error.message}`);
};

// ============================================
// 7. 首页视频 (Hero Videos)
// ============================================

export const getHeroVideos = async (): Promise<HeroVideo[]> => {
    if (!isSupabaseConfigured) {
        return getFromLocalStorage<HeroVideo[]>('heroVideos', []);
    }

    const { data, error } = await supabase
        .from('hero_videos')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw new Error(`获取首页视频失败: ${error.message}`);
    return data;
};

export const saveHeroVideo = async (item: HeroVideo) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<HeroVideo[]>('heroVideos', []);
        const exists = list.findIndex(i => i.id === item.id);
        if (exists >= 0) {
            list[exists] = item;
        } else {
            list.push(item);
        }
        saveToLocalStorage('heroVideos', list);
        return;
    }

    const { error } = await supabase.from('hero_videos').upsert(item);
    if (error) throw new Error(`保存首页视频失败: ${error.message}`);
};

export const deleteHeroVideo = async (id: string) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<HeroVideo[]>('heroVideos', []);
        saveToLocalStorage('heroVideos', list.filter(i => i.id !== id));
        return;
    }

    const { error } = await supabase.from('hero_videos').delete().eq('id', id);
    if (error) throw new Error(`删除首页视频失败: ${error.message}`);
};

// ============================================
// 8. 参建单位 (Participating Units)
// ============================================

export const getParticipatingUnits = async (): Promise<ParticipatingUnit[]> => {
    if (!isSupabaseConfigured) {
        return getFromLocalStorage<ParticipatingUnit[]>('participatingUnits', []);
    }

    const { data, error } = await supabase
        .from('participating_units')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw new Error(`获取参建单位失败: ${error.message}`);
    return data;
};

export const saveParticipatingUnit = async (item: ParticipatingUnit) => {
    if (!isSupabaseConfigured) {
        const list = getFromLocalStorage<ParticipatingUnit[]>('participatingUnits', []);
        const exists = list.findIndex(i => i.id === item.id);
        if (exists >= 0) {
            list[exists] = item;
        } else {
            list.push(item);
        }
        saveToLocalStorage('participatingUnits', list);
        return;
    }

    const { error } = await supabase.from('participating_units').upsert(item);
    if (error) throw new Error(`保存参建单位失败: ${error.message}`);
};

// ============================================
// 9. AI 配置 (AI Config)
// ============================================

export const getAIConfig = async (): Promise<AIConfig> => {
    const defaultConfig: AIConfig = {
        provider: 'custom',
        providerName: 'Gemini',
        apiKey: '',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        model: 'gemini-2.0-flash-exp',
        systemPrompt: '你是一个专业的BIM技术顾问，帮助用户了解本项目的BIM应用情况。'
    };

    if (!isSupabaseConfigured) {
        return getFromLocalStorage<AIConfig>('aiConfig', defaultConfig);
    }

    const { data, error } = await supabase
        .from('ai_config')
        .select('*')
        .single();

    if (error) return defaultConfig;

    return {
        provider: data.provider || 'custom',
        providerName: data.provider_name || 'Gemini',
        apiKey: data.api_key || '',
        baseUrl: data.base_url || defaultConfig.baseUrl,
        model: data.model || defaultConfig.model,
        systemPrompt: data.system_prompt || defaultConfig.systemPrompt,
        knowledgeBase: data.knowledge_base,
        documents: data.documents
    };
};

export const updateAIConfig = async (config: AIConfig) => {
    if (!isSupabaseConfigured) {
        saveToLocalStorage('aiConfig', config);
        return;
    }

    const dbData = {
        provider: config.provider,
        provider_name: config.providerName,
        api_key: config.apiKey,
        base_url: config.baseUrl,
        model: config.model,
        system_prompt: config.systemPrompt,
        knowledge_base: config.knowledgeBase,
        documents: config.documents
    };

    const { error } = await supabase.from('ai_config').upsert(dbData);
    if (error) throw new Error(`更新AI配置失败: ${error.message}`);
};

// ============================================
// 导出配置状态
// ============================================
export { isSupabaseConfigured };
