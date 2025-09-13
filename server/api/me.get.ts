import { jwtVerify } from "jose";

const enc = new TextEncoder();
const secret = () =>
  enc.encode(process.env.NUXT_SESSION_SECRET || "dev_secret");

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, "authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) throw createError({ statusCode: 401, statusMessage: "No token" });

  const { payload } = await jwtVerify(token, await secret());
  return payload; // { uid, email, iat, exp }
});
