import { GoogleGenAI } from "@google/genai";

// Fix: Per coding guidelines, assume API_KEY is always present in process.env.
// The client should be initialized directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlurb = async (promptText: string): Promise<string> => {
  // Fix: Removed check for 'ai' initialization as we now assume it's always available.
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a professional, one-sentence summary for a ${promptText}. Make it sound engaging and skilled.`
    });
    return response.text;
  } catch (error) {
    console.error("Error generating blurb:", error);
    return "Failed to generate blurb. Please try again.";
  }
};
