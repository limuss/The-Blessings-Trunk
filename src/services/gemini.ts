
import { GoogleGenAI } from "@google/genai";

// Standard implementation for handling chat requests with the Gemini 3 Flash model.
export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'model', text: string }[]) => {
  // Always initialize GoogleGenAI within the call scope to ensure the latest environment config is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Using ai.models.generateContent as it is the recommended way for text-based answers.
    // We pass the conversation history along with the new user message.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        // Map history to the format expected by the SDK
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        // Add the new user message
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      config: {
        systemInstruction: `You are 'Trunk Assistant', the helpful concierge for 'The Blessings Trunk' - a premium dry fruit hamper shop from Jammu & Kashmir.
        
        Your goals are:
        1. Welcome the user warmly.
        2. Ask simple questions to understand their needs (Occasion, Budget, Preferred dry fruits).
        3. Recommend specific hampers based on their answers.
        
        Our current collection includes:
        - Royal Kashmiri Trunk (₹4500): Large walnut trunk, all premium varieties.
        - Saffron & Gold Delight (₹3200): Saffron-themed festival box.
        - Nurture Box (₹2800): For new mothers.
        - Petite Blessing (₹1500): Smaller entry-level gift.
        - Celebration Tray (₹3800): Open tray for family gatherings.
        
        Style: Elegant, polite, warm, and professional. Use subtle Kashmiri references if appropriate. Keep responses concise.
        
        Our official WhatsApp contact for orders is +91 60055 02054.`,
      },
    });

    // Access the .text property directly as per the latest SDK guidelines.
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having a little trouble connecting. Could you please try again later or call us directly at +91 60055 02054?";
  }
};
