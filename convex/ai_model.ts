import { action } from "./_generated/server"
import { v } from "convex/values"
import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const sendMessage = action({
  args: {
    message: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-safeguard-20b",
        messages: [
          {
            role: "system",
            content: `
              You are Herbal Mind AI, an expert in medicinal herbs, herbal remedies, plant-based nutrition, and wellness.

              Your primary purpose is to provide information about herbs, medicinal plants, traditional remedies, and their safe use.

              When discussing herbs:
              - Explain benefits and uses clearly.
              - Mention possible side effects when relevant.
              - Mention known drug interactions when relevant.
              - Encourage consulting healthcare professionals for medical concerns.

              If asked a question outside herbal health, answer briefly but politely remind the user that your specialty is herbal medicine.
            `
          },
          {
            role: "user",
            content: args.message,
          }
        ]
      });
  
      return response.choices[0].message.content;;
    } catch (error) {
      console.error(error);
      return("Sorry the AI failed to respond. Please try again.");
    }
  },
});