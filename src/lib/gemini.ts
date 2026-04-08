import { GoogleGenAI, Type } from "@google/genai";

function getAIClient() {
  const localKey = typeof window !== "undefined" ? localStorage.getItem("gemini_api_key") : null;
  const apiKey = localKey || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey });
}

export async function generateFinancialPost(data: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following financial data and create a compelling, professional Binance Square post. 
    The post should be engaging, include relevant hashtags, and be suitable for a crypto audience.
    
    Data: ${data}`,
    config: {
      systemInstruction: "You are a professional crypto analyst and content creator for Binance Square.",
    },
  });

  return response.text;
}

export async function gatherFinancialData(query: string) {
  const ai = getAIClient();
  const response = await (ai.models as any).generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gather and summarize the latest financial data and news for: ${query}. 
    Focus on price action, market sentiment, and key events.`,
    tools: [{ googleSearch: {} }],
    toolConfig: { includeServerSideToolInvocations: true }
  });

  return response.text;
}
