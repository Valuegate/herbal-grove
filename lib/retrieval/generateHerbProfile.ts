import "server-only";

import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const HerbProfileSchema = z.object({
  description: z.string(),
  traditionalUses: z.array(z.string()),
  potentialBenefits: z.array(z.string()),
  safetyConsiderations: z.array(z.string()),
});

export type HerbProfile = z.infer<typeof HerbProfileSchema>;

const stringArraySchema = { type: "array", items: { type: "string" } };

const SYSTEM_PROMPT = `
  You are an expert botanical and medicinal plant researcher working for HerbaGrove.

  Create a concise herb profile using ONLY the research provided below.

  The plant was identified externally by Pl@ntNet. Do not question or change the identified scientific name.

  IMPORTANT RULES:

  1. SOURCE GROUNDING
  - Use ONLY information contained in the provided research.
  - Do not use your general knowledge.
  - Do not invent facts, uses, benefits, or safety information.
  - If the research does not contain enough information for a section, return an empty array.

  2. TRADITIONAL USES
  - Only include uses explicitly described as traditional, historical, folkloric, or customary uses.
  - Do not present traditional use as proof that the herb treats or cures a condition.

  3. RESEARCH FINDINGS
  - Only include potential benefits or findings that are actually supported by the research.
  - Do not turn an experimental finding into a proven medical benefit.
  - Preserve appropriate scientific uncertainty.
  - Prefer phrases such as "research suggests", "studies reported", "was associated with", or "has been investigated for" when appropriate.
  - Never claim that the herb can cure, prevent, or definitively treat a disease unless the provided research explicitly supports such a conclusion.

  4. SAFETY
  - Only include safety concerns, side effects, contraindications, interactions, or dosage-related information explicitly supported by the research.
  - Do not invent warnings from general knowledge.
  - If the research contains no relevant safety information, return an empty array.

  5. DESCRIPTION
  - Give a short factual description based only on the provided research.

  6. OUTPUT
  Return:
  - A short description of the herb.
  - Traditional uses mentioned in the research.
  - Potential benefits or research findings supported by the research.
  - Safety considerations mentioned in the research.
`;

export async function generateHerbProfile(
  scientificName: string,
  commonName: string | null,
  research: { text: string; similarity: number }[]
): Promise<HerbProfile> {
  const researchText = research
    .map((chunk, index) => `Research Source ${index + 1}:\n${chunk.text}`)
    .join("\n\n");

  const completion = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    temperature: 0,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Identified herb:\nScientific name: ${scientificName}\nCommon name: ${commonName ?? "Unknown"}\n\nResearch: ${researchText}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "herb_profile",
        strict: true,
        schema: {
          type: "object",
          properties: {
            description: { type: "string" },
            traditionalUses: stringArraySchema,
            potentialBenefits: stringArraySchema,
            safetyConsiderations: stringArraySchema,
          },
          required: ["description", "traditionalUses", "potentialBenefits", "safetyConsiderations"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = completion.choices[0].message.content ?? "{}";

  try {
    return HerbProfileSchema.parse(JSON.parse(content));
  } catch (error) {
    console.error("Failed to parse herb profile:", error);
    throw new Error("Failed to generate herb profile.");
  }
}