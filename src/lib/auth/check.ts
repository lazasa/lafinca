import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { TokenPayload } from "@/types/auth";

export async function checkAccess (request: NextRequest): Promise<TokenPayload | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyAccessToken(token);

  if (!payload || payload.type !== "access") {
    return null;
  }
  
  return payload
}