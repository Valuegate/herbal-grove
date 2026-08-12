import { action } from "./_generated/server";
import { v } from "convex/values";
import { Groq } from "groq-sdk";
import { Id } from "./_generated/dataModel";
import { buildContext } from "../lib/retrieval/buildContext";
import { api } from "./_generated/api";
import { generateEmbedding } from "../lib/embeddings/generateEmbeddings";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "openai/gpt-oss-safeguard-20b";
type Reference = {
  text: string;
  similarity: number;
  documentId: Id<"documents">;
  page?: number;
};

type SendMessageResponse = {
  answer: string;
  source: "rag" | "llm";
  references: Reference[];
};

const RAG_SYSTEM_PROMPT = (context: string) => `
  You are Herbal Mind AI.

  You are answering using ONLY the verified research provided below.

  Do not use your own knowledge.

  If the answer cannot be completely answered using the supplied research, reply with ONLY:

  NOT_FOUND

  Verified Research:
  ${context}
`;

const GENERAL_SYSTEM_PROMPT = `
  You are Herbal Mind AI, a friendly assistant whose expertise is medicinal herbs, herbal remedies, medicinal plants, and herbal wellness.

  You ONLY answer questions related to:
  - Herbs and medicinal plants
  - Herbal preparations and traditional herbal uses
  - Herbal nutrition and wellness
  - Safe herbal practices
  - Herb cultivation and identification

  If a question is unrelated to herbal medicine or plants, politely refuse by replying:

  "Sorry, I'm designed to answer questions about herbs, medicinal plants, and herbal wellness only."

  Do not answer unrelated questions.

  When answering:
  - Keep your tone warm, friendly, and conversational.
  - Write naturally, like you're chatting with someone.
  - Keep most responses under 120 words unless the user asks for more detail.
  - Avoid Markdown tables.
  - Avoid long numbered lists unless specifically requested.
  - Use simple language.
  - Never exaggerate benefits.
  - Never claim an herb cures diseases.
  - Mention important side effects when relevant.
  - Mention important drug interactions when relevant.
  - Encourage consulting a qualified healthcare professional for diagnosis or treatment decisions.

  If information is uncertain, say so honestly. Never invent information.
`;

async function askGroq(systemPrompt: string, question: string) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
  });

  return response.choices[0].message.content ?? "";
}

export const sendMessage = action({
  args: { message: v.string() },
  handler: async (ctx, args): Promise<SendMessageResponse> => {
    try {
      const embedding = await generateEmbedding(args.message)
      const chunks = await ctx.runQuery(api.chunk.searchChunks, {embedding, limit: 5});

      if (chunks.length > 0 && chunks[0].similarity >= 0.8) {
        const context = buildContext(chunks);
        const ragAnswer = await askGroq(RAG_SYSTEM_PROMPT(context), args.message);

        if (!ragAnswer.trim().startsWith("NOT_FOUND")) {
          return { answer: ragAnswer, source: "rag" as const, references: chunks };
        }
      }

      const llmAnswer = await askGroq(GENERAL_SYSTEM_PROMPT, args.message);
      return { answer: llmAnswer, source: "llm" as const, references: [] };
    } catch (error) {
      console.error(error);
      return {
        answer: "Sorry, the AI failed to respond. Please try again.",
        source: "llm" as const,
        references: [],
      };
    }
  },
});