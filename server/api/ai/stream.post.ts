import OpenAI from "openai";

type Msg = { role: "system" | "user" | "assistant"; content: string };

function serializeMessages(messages: Msg[]) {
  const lines = messages.map(
    (m) => `${m.role.toUpperCase()}: ${m.content.trim()}`
  );
  return lines.join("\n") + "\nASSISTANT:";
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ messages: Msg[] }>(event);
  if (!body?.messages?.length) {
    throw createError({ statusCode: 400, statusMessage: "Missing messages" });
  }

  const { OPENAI_API_KEY } = useRuntimeConfig();
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const ai = await client.responses.stream({
    model: "gpt-4o-mini",
    instructions:
      "Svar konsist på norsk, og be om presiseringer ved uklarheter.",
    input: serializeMessages(body.messages),
  });

  setHeader(event, "Content-Type", "text/event-stream; charset=utf-8");
  setHeader(event, "Cache-Control", "no-cache, no-transform");
  setHeader(event, "Connection", "keep-alive");

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (d: string) =>
        controller.enqueue(encoder.encode(`data: ${d}\n\n`));
      const keepAlive = setInterval(
        () => controller.enqueue(encoder.encode(`: ping\n\n`)),
        15000
      );

      try {
        for await (const part of ai) {
          switch (part.type) {
            case "response.output_text.delta":
              send(part.delta);
              break;
            case "response.completed":
              send("[DONE]");
              break;
            case "error": {
              const err = (part as any).error;
              send(JSON.stringify({ error: err?.message ?? "stream error" }));
              break;
            }
            default:
              break;
          }
        }
      } finally {
        clearInterval(keepAlive);
        controller.close();
      }
    },
  });
});
