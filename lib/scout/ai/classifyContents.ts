import "server-only";

import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY!,});

const ClassificationSchema = z.object({
  relevant: z.boolean(),
  relevanceScore: z.number(),
  topics: z.array(z.string()),
  plants: z.array(z.string()),
  compounds: z.array(z.string()),
  drugs: z.array(z.string()),
  contentType: z.string(),
  evidenceType: z.string(),
});

export type ContentClassification = z.infer<
  typeof ClassificationSchema
>;

const SYSTEM_PROMPT = `
You are the research screening system for HerbaGrove.

HerbaGrove is a knowledge platform focused on medicinal herbs,
medicinal plants, traditional medicine, herbal remedies,
ethnobotany, and plant-based research.

Analyze the provided content and determine whether it is relevant
to HerbaGrove.

Identify:

1. Whether the content is relevant.
2. A relevance score from 0 to 1.
3. The topics discussed.
4. Plants or herbs explicitly mentioned.
5. Medicinal compounds explicitly mentioned.
6. Drugs or medicines explicitly mentioned.
7. The type of content.
8. The type of evidence presented.

Possible content types include:
- scientific research
- research discussion
- traditional use
- herbal remedy
- preparation method
- safety information
- personal experience
- general discussion

Possible evidence types include:
- scientific research
- secondary reference
- traditional knowledge
- anecdotal
- unknown

IMPORTANT:
- Do not invent plants, compounds, drugs, or information.
- Only identify entities explicitly mentioned in the content.
- A plant-derived compound is NOT a plant.
- A drug or medicine is NOT a plant.
- Keep plants, compounds, and drugs in their correct categories.
- If an entity is derived from a plant but is itself a compound or drug, classify it as a compound or drug rather than a plant.
`;

export async function classifyContent(
  content: string
): Promise<ContentClassification> {
  const preview = content.slice(0, 12000);
  const completion = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    temperature: 0,
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: preview
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "content_classification",
        strict: true,
        schema: {
          type: "object",
          properties: {
            relevant: {
              type: "boolean",
            },
            relevanceScore: {
              type: "number",
            },
            topics: {
              type: "array",
              items: {
                type: "string",
              },
            },
            plants: {
              type: "array",
              items: {
                type: "string",
              },
            },
            compounds: {
              type: "array",
              items: {
                type: "string",
              },
            },
            drugs: {
              type: "array",
              items: {
                type: "string",
              },
            },
            contentType: {
              type: "string",
            },
            evidenceType: {
              type: "string",
            },
          },
          required: [
            "relevant",
            "relevanceScore",
            "topics",
            "plants",
            "compounds",
            "drugs",
            "contentType",
            "evidenceType",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const result = completion.choices[0].message.content;

  if (!result) {
    throw new Error("AI returned an empty response.");
  }

  return ClassificationSchema.parse(JSON.parse(result));
}