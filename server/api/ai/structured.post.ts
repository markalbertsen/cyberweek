import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody<{ prompt: string }>(event);
  if (!prompt)
    throw createError({ statusCode: 400, statusMessage: "Missing prompt" });

  const { OPENAI_API_KEY } = useRuntimeConfig();
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const resp = await client.responses.create({
    model: "gpt-4o-mini",
    input: `Bruker: ${prompt}`,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "chat_analysis",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            answer: { type: "string" },
            tone: { type: "string", enum: ["nøytral", "vennlig", "formell"] },
            keywords: { type: "array", items: { type: "string" } },
          },
          required: ["answer"],
        },
      },
    },
  });

  // SDK returnerer tekstfelt med valid JSON
  const json = JSON.parse((resp as any).output_text || "{}");
  return json;
});
