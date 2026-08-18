import { createRemoteJWKSet, jwtVerify } from "jose";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createStableUuid } from "../src/utility/stableUuid.js";

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
);

function json(
  response: VercelResponse,
  body: Record<string, string>,
  status = 200,
) {
  response.setHeader("cache-control", "no-store");
  return response.status(status).json(body);
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const authorization = Array.isArray(request.headers.authorization)
    ? request.headers.authorization[0]
    : request.headers.authorization;
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!projectId || !token) {
    return json(response, { error: "Unauthorized" }, 401);
  }

  try {
    const { payload } = await jwtVerify(token, GOOGLE_JWKS, {
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
    });

    if (!payload.sub) {
      return json(response, { error: "Unauthorized" }, 401);
    }

    return json(response, {
      "X-Hasura-Role": "user",
      "X-Hasura-User-Id": createStableUuid(`firebase:${payload.sub}`),
    });
  } catch {
    return json(response, { error: "Unauthorized" }, 401);
  }
}
