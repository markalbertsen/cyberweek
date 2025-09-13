import { clearSession } from "../utils/session";

export default defineEventHandler(async (event) => {
  clearSession(event);
  return { message: "Logged out" };
});
