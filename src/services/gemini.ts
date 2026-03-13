import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeDocument(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: base64Image.split(",")[1],
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this document and provide a brief, clear report in English. 
            Provide the output in JSON format:
            1. simplifiedText: A brief, clear explanation of the document's content at a 5th-grade reading level. **Bold the main condition or disease name** using markdown (e.g., **Diabetes**). Keep it concise.
            2. deadline: Any specific deadline or due date mentioned (if none, return null).
            3. checklist: A list of "Next Steps" the user should take.
            4. draftReply: A professional draft reply if the document requires a response (if none, return null).
            5. documentType: The type of document (e.g., Legal, Medical, Insurance, Utility).
            6. diseaseManagement: If this is a medical document, provide a markdown formatted section on "What to do" for the condition mentioned. If not medical, return null.
            7. lifestyleMaintenance: If this is a medical document, provide a markdown formatted section on "Lifestyle & Maintenance" suggestions. If not medical, return null.`,
          },
        ],
      },
    ],
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          simplifiedText: { type: Type.STRING },
          deadline: { type: Type.STRING, nullable: true },
          checklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          draftReply: { type: Type.STRING, nullable: true },
          documentType: { type: Type.STRING },
          diseaseManagement: { type: Type.STRING, nullable: true },
          lifestyleMaintenance: { type: Type.STRING, nullable: true },
        },
        required: ["simplifiedText", "checklist", "documentType"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as AnalysisResult;
}

export async function chatWithDocument(
  message: string, 
  analysisContext: AnalysisResult, 
  history: { role: "user" | "model", parts: { text: string }[] }[]
) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: history,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: `You are Life Admin AI. You have analyzed a document for the user. 
      Context of the document:
      Type: ${analysisContext.documentType}
      Summary: ${analysisContext.simplifiedText}
      Deadline: ${analysisContext.deadline || "None"}
      Next Steps: ${analysisContext.checklist.join(", ")}
      
      Answer the user's questions about this document briefly and clearly in English.`,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
