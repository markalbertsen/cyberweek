/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const secret = () =>
  encoder.encode(process.env.NUXT_SESSION_SECRET || "dev_secret");
const cookieName = "session";

export async function setSession(event: any, payload: object) {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // token valid for 7 days
    .sign(await secret());

  setCookie(event, cookieName, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSession(event: any) {
  deleteCookie(event, cookieName, { path: "/" });
}

export async function getSession(event: any) {
  const token = getCookie(event, cookieName);
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, await secret());
    return payload;
  } catch {
    return null;
  }
}
