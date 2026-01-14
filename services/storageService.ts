/**
 * Supabase Storage 文件上传服务
 * 用途：处理图片、视频、文档等大文件的云端存储
 * 
 * 存储桶说明：
 * - images: 存放图片（缩略图、成果图片等）
 * - videos: 存放视频文件
 * - documents: 存放 PDF、Word、Revit 等文档
 */

import { supabase } from './supabaseClient';

// 存储桶名称
const BUCKETS = {
    IMAGES: 'images',
    VIDEOS: 'videos',
    DOCUMENTS: 'documents'
} as const;

type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

/**
 * 生成唯一文件名
 * 格式: 时间戳_随机数_原文件名
 */
const generateUniqueFileName = (originalName: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    // 处理文件名中的特殊字符
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_\u4e00-\u9fa5]/g, '_');
    return `${timestamp}_${random}_${safeName}`;
};

/**
 * 根据文件类型确定存储桶
 */
const getBucketByFileType = (file: File): BucketName => {
    const type = file.type.toLowerCase();

    if (type.startsWith('image/')) {
        return BUCKETS.IMAGES;
    }
    if (type.startsWith('video/')) {
        return BUCKETS.VIDEOS;
    }
    // 其他文件（PDF、Word、Revit 等）归类为文档
    return BUCKETS.DOCUMENTS;
};

/**
 * 上传单个文件到 Supabase Storage
 * @param file - 要上传的文件对象
 * @param folder - 可选，存储桶内的子文件夹路径
 * @returns 文件的公开访问 URL
 */
export const uploadFile = async (
    file: File,
    folder?: string
): Promise<string> => {
    const bucket = getBucketByFileType(file);
    const fileName = generateUniqueFileName(file.name);
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    console.log(`📤 正在上传文件到 ${bucket}/${filePath}...`);

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '3600', // 1小时缓存
            upsert: false // 不覆盖同名文件
        });

    if (error) {
        console.error('❌ 文件上传失败:', error.message);
        throw new Error(`文件上传失败: ${error.message}`);
    }

    // 获取公开访问 URL
    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    console.log('✅ 文件上传成功:', urlData.publicUrl);
    return urlData.publicUrl;
};

/**
 * 上传 Base64 编码的图片
 * 用于兼容现有的图片上传逻辑（之前存的是 Base64）
 * @param base64Data - Base64 编码的图片数据（含或不含 data:image/xxx;base64, 前缀）
 * @param fileName - 文件名
 * @returns 文件的公开访问 URL
 */
export const uploadBase64Image = async (
    base64Data: string,
    fileName: string
): Promise<string> => {
    // 提取 Base64 纯数据部分
    let pureBase64 = base64Data;
    let mimeType = 'image/png'; // 默认

    if (base64Data.includes(',')) {
        const [header, data] = base64Data.split(',');
        pureBase64 = data;
        // 从 header 提取 MIME 类型
        const match = header.match(/data:(.*?);/);
        if (match) {
            mimeType = match[1];
        }
    }

    // 将 Base64 转换为 Blob
    const byteCharacters = atob(pureBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // 创建 File 对象
    const extension = mimeType.split('/')[1] || 'png';
    const file = new File([blob], `${fileName}.${extension}`, { type: mimeType });

    return uploadFile(file);
};

/**
 * 删除文件
 * @param fileUrl - 文件的公开 URL
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
    // 从 URL 解析出 bucket 和 path
    // URL 格式: https://xxx.supabase.co/storage/v1/object/public/bucket/path
    try {
        const url = new URL(fileUrl);
        const pathParts = url.pathname.split('/storage/v1/object/public/');
        if (pathParts.length < 2) {
            console.warn('无法解析文件路径，跳过删除:', fileUrl);
            return;
        }

        const [bucket, ...pathSegments] = pathParts[1].split('/');
        const filePath = pathSegments.join('/');

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('删除文件失败:', error.message);
            throw new Error(`删除文件失败: ${error.message}`);
        }

        console.log('✅ 文件删除成功:', filePath);
    } catch (err) {
        console.error('删除文件时出错:', err);
    }
};

/**
 * 获取文件大小的格式化字符串
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 检查文件大小是否超限
 * @param file - 文件对象
 * @param maxSizeMB - 最大允许大小（MB）
 */
export const checkFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
};

// 导出存储桶常量
export { BUCKETS };
