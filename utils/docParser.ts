
/**
 * Document Parser Utility
 * Parses text content from various file formats (TXT, DOCX, PDF)
 * Uses dynamic imports to load external libraries only when needed
 */

export const parseFileContent = async (file: File): Promise<string> => {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    try {
        // Plain text files - native support
        if (fileType === 'txt' || fileType === 'md' || fileType === 'json' || fileType === 'csv') {
            return await file.text();
        }

        // Word documents (.docx)
        else if (fileType === 'docx') {
            // Dynamic import mammoth from CDN
            const mammoth = await import(/* @vite-ignore */ 'https://esm.sh/mammoth@1.6.0');
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.default.extractRawText({ arrayBuffer });
            return result.value;
        }

        // PDF files
        else if (fileType === 'pdf') {
            // Dynamic import pdfjs-dist from CDN
            const pdfjsLib = await import(/* @vite-ignore */ 'https://esm.sh/pdfjs-dist@3.11.174');

            // Set worker source
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += `\n--- 第${i}页 ---\n${pageText}`;
            }
            return fullText;
        }

        return `[不支持的文件类型: ${fileType}]`;
    } catch (error) {
        console.error("文件解析错误:", error);
        return `[解析文件时出错: ${error}]`;
    }
};
