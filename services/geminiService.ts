
import { PROJECT_INFO, HIGHLIGHTS } from "../constants";
import { AIConfig } from "../types";

// Construct the context string
const buildContext = () => {
  return `
Context:
Project Name: ${PROJECT_INFO.name}
Description: ${PROJECT_INFO.description}
Location: ${PROJECT_INFO.location}
Highlights: ${HIGHLIGHTS.map(h => h.title + ": " + h.summary).join("; ")}
`;
};

export const generateProjectResponse = async (userMessage: string, config: AIConfig): Promise<string> => {
  if (!config.apiKey) {
    return "请先在管理后台配置 AI API Key。";
  }

  const finalSystemPrompt = `${config.systemPrompt}\n${buildContext()}`;

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
        max_tokens: 512
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
