import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody<{ prompt: string }>(event);
  if (!prompt)
    throw createError({ statusCode: 400, statusMessage: "Missing prompt" });

  const { OPENAI_API_KEY } = useRuntimeConfig();
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const resp = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });

  const text =
    resp.output?.map((p: any) => p.content?.[0]?.text || "").join("") ??
    resp.output_text ??
    "";

  return { text };
});
