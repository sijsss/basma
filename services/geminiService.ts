
import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord } from "../types";

export const getAttendanceSummary = async (records: AttendanceRecord[]) => {
  // Always initialize GoogleGenAI inside the function scope to use the current API key from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const summaryPrompt = `
    حلل بيانات الحضور والانصراف التالية لموظفي الشركة وقدم ملخصاً إدارياً باللغة العربية:
    ${JSON.stringify(records)}
    
    المطلوب:
    1. تقييم عام للالتزام بالمواعيد.
    2. ملاحظة أي أنماط غير معتادة (تأخير متكرر، ساعات إضافية مفرطة).
    3. توصيات لتحسين الإنتاجية.
    4. حساب متوسط ساعات العمل.
    
    يرجى تقديم التقرير بتنسيق Markdown احترافي.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: summaryPrompt,
    });
    // Correctly accessing the text property from the response object
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "عذراً، تعذر إنشاء التقرير الذكي حالياً.";
  }
};