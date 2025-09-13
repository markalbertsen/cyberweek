import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const prisma = new PrismaClient();

const enc = new TextEncoder();
const secret = () =>
  enc.encode(process.env.NUXT_SESSION_SECRET || "dev_secret");

type JwtPayload = { uid: number; email: string };

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{
    email: string;
    password: string;
  }>(event);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });

  const payload: JwtPayload = { uid: user.id, email: user.email };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(await secret());

  // Return token & (optionally) a safe user object
  return { token, user: { id: user.id, email: user.email } };
});
