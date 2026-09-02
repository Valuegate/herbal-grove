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
  const preview = text.slice(0, 16000);

  const completion = await groq.chat.completions.create({
  model: "qwen/qwen3.8-27b",
  temperature: 0,
  messages: [
    {
      role: "system",
      content: `
You are an expert botanist and medicinal plant researcher.

Identify every medicinal herb mentioned in the research paper.

Only include herbs that are actually mentioned in the provided text.
Do not invent herbs or information that is not supported by the text.
If no herbs are found, return an empty array.
      `,
    },
    {
      role: "user",
      content: preview,
    },
  ],
  response_format: {
  type: "json_schema",
  json_schema: {
    name: "herb_extraction",
    strict: true,
    schema: {
      type: "object",
      properties: {
        herbs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              scientificName: {
                type: "string",
              },
              commonNames: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              aliases: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              family: {
                type: "string",
              },
              genus: {
                type: "string",
              },
              species: {
                type: "string",
              },
              description: {
                type: "string",
              },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "scientificName",
              "commonNames",
              "aliases",
              "family",
              "genus",
              "species",
              "description",
              "tags",
            ],
            additionalProperties: false,
          },
        },
      },
      required: ["herbs"],
      additionalProperties: false,
    },
  },
},
});

  const content =
    completion.choices[0].message.content ?? "[]";

  try {
    const parsed = JSON.parse(content);

    return HerbsSchema.parse(parsed.herbs);
  } catch (error) {
    console.error(
      "Failed to parse Groq response:",
      error
    );

    return [];
  }
}