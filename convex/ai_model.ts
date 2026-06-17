import { action } from "./_generated/server"
import { v } from "convex/values"
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const sendMessage = action({
  args: {
    message: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: args.message,
      });
  
      return response.text;
    } catch (error) {
      console.error(error);
      return("Sorry the AI failed to respond. Please try again.");
    }
  },
});