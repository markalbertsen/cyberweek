import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const enc = new TextEncoder();
const secret = () =>
  enc.encode(process.env.NUXT_SESSION_SECRET || "dev_secret");

export default defineEventHandler(async (event) => {
  // check Authorization: Bearer <token>
    const auth = getHeader(event, "authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) throw createError({ statusCode: 401, statusMessage: "No token" });

  await jwtVerify(token, await secret()); 

  // return recent users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return { users };
});
