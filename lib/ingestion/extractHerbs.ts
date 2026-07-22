import "server-only";

import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const HerbSchema = z.object({
  scientificName: z.string(),
  commonNames: z.array(z.string()),
  aliases: z.array(z.string()),
  family: z.string().optional(),
  genus: z.string().optional(),
  species: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()),
});

const HerbsSchema = z.array(HerbSchema);

export type ExtractedHerb = z.infer<typeof HerbSchema>;

export async function extractHerbs(
  text: string
): Promise<ExtractedHerb[]> {
  const preview = text.slice(0, 25000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are an expert botanist and medicinal plant researcher.

Your task is to identify every medicinal herb mentioned in the research paper.

Return ONLY valid JSON.

The response MUST be an array.

Each herb MUST follow this schema:

[
  {
    "scientificName": "",
    "commonNames": [],
    "aliases": [],
    "family": "",
    "genus": "",
    "species": "",
    "description": "",
    "tags": []
  }
]

Rules:
- Return ONLY JSON.
- Do NOT wrap the response in markdown.
- Do NOT explain your answer.
- If no herbs are found, return [].
`,
      },
      {
        role: "user",
        content: preview,
      },
    ],
  });

  const content =
    completion.choices[0].message.content ?? "[]";

  try {
    const parsed = JSON.parse(content);

    return HerbsSchema.parse(parsed);
  } catch (error) {
    console.error(
      "Failed to parse Groq response:",
      error
    );

    return [];
  }
}