
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLegalAdvice = async (caseType: string, step: string, notes: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a legal assistant for an advocate using the 'Adv Dairy' app. 
      The current case type is '${caseType}' and the next procedural step is '${step}'. 
      Here are the advocate's notes: '${notes}'. 
      Provide 3 concise, actionable bullet points for preparation for this specific court hearing.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not load AI insights at this time.";
  }
};
