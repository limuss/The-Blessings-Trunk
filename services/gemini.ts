
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'model', text: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      config: {
        tools: [{ googleMaps: {} }],
        systemInstruction: `You are 'Trunk Assistant', the helpful concierge for 'The Blessings Trunk' - a premium dry fruit hamper shop from Jammu & Kashmir.
        
        Your goals are:
        1. Welcome the user warmly.
        2. Help them find our boutiques in Kashmir. We have shops in Srinagar (NST Complex), Gulmarg (Main Market), and Pahalgam (Market Square).
        3. Recommend specific hampers based on their needs.
        
        Our collection includes:
        - Royal Kashmiri Trunk (₹4500)
        - Saffron & Gold Delight (₹3200)
        - Nurture Box (₹2800)
        
        Style: Elegant, polite, warm. Use Google Maps tool to help with location-based queries about our shops or general Kashmiri geography.
        
        Our official WhatsApp: +91 88990 43549.`,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting. Please call us directly at +91 88990 43549.";
  }
};
