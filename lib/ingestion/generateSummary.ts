import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateSummary( text: string ): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-safeguard-20b",
    messages: [{
      role: "system",
      content: `
        You summarize herbal research papers.

        Write a concise summary.

        Rules:
        - Maximum 60 words.
        - Explain the paper simply.
        - Mention the herb and its primary focus.
        - Do not exaggerate findings.
        - Do not mention study methodology unless necessary.
      `},
      {
        role: "user",
        content: text.slice(0, 8000),
      }
      ]
    });

  return (response.choices[0].message.content ?? "");
}