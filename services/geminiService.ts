
import { AIConfig, ProjectInfo, Highlight, Achievement, TeamMember, KnowledgeDocument } from "../types";

// Define interface for context data
interface ProjectContextData {
  projectInfo: ProjectInfo;
  highlights: Highlight[];
  achievements: Achievement[];
  teamMembers: TeamMember[];
  documents?: KnowledgeDocument[];
}

// Construct the context string dynamically
const buildContext = (data: ProjectContextData, knowledgeBase: string = "") => {
  const { projectInfo, highlights, achievements, teamMembers, documents } = data;

  return `
【项目当前实时数据】
1. 项目基本信息：
   - 名称：${projectInfo.name}
   - 描述：${projectInfo.description}
   - 地址：${projectInfo.location}
   - 总建筑面积：${projectInfo.totalArea}
   - 总投资额：${projectInfo.investment}

2. 核心亮点应用 (${highlights.length}项)：
   ${highlights.map((h, i) => `${i + 1}. ${h.title}: ${h.summary}`).join('\n   ')}

3. 应用成效与奖项：
   ${achievements.map(a => `- [${a.type}] ${a.title} (${a.date})`).join('\n   ')}

4. 团队核心成员：
   ${teamMembers.map(m => `- ${m.name} (${m.role}): ${m.contact}`).join('\n   ')}

[补充知识库/文档内容]:
${knowledgeBase ? "【手动输入/旧资料】:\n" + knowledgeBase.substring(0, 5000) + "\n" : ""}
${(documents || []).length > 0 ? "【上传文档资料】:\n" + (documents || []).map(doc => `--- 文档: ${doc.name} ---\n${doc.content.substring(0, 8000)}`).join('\n\n') : "暂无上传文档"}
`;
};

export const generateProjectResponse = async (
  userMessage: string,
  config: AIConfig,
  contextData: ProjectContextData
): Promise<string> => {
  if (!config.apiKey) {
    return "请先在管理后台配置 AI API Key。";
  }

  // Combine System Prompt with Dynamic Context
  const finalSystemPrompt = `${config.systemPrompt}\n\n${buildContext(contextData, config.knowledgeBase)}`;

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: finalSystemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AI API Error Details:", errorData);
      throw new Error(`API Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "抱歉，无法从模型获取回复。";

  } catch (error) {
    console.error("AI Service Error:", error);
    return "连接 AI 服务失败，请检查网络或后台配置的 API Key 是否正确。";
  }
};
