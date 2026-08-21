import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { FastifyReply, FastifyRequest } from "fastify";
import { createStableUuid } from "../src/utility/stableUuid.js";

const firebaseProjectId =
  process.env.FIREBASE_PROJECT_ID ?? process.env.VITE_FIREBASE_PROJECT_ID;

if (firebaseProjectId && !getApps().length) {
  initializeApp({ projectId: firebaseProjectId });
}

export const isLocalAuthEnabled =
  process.env.ALLOW_LOCAL_AUTH === "true" ||
  (!firebaseProjectId && process.env.NODE_ENV !== "production");

declare module "fastify" {
  interface FastifyRequest {
    currentUserId: string;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (firebaseProjectId) {
    const token = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      request.currentUserId = createStableUuid(`firebase:${decodedToken.uid}`);
      return;
    } catch {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  }

  if (isLocalAuthEnabled) {
    const localUserId = request.headers["x-local-user-id"];
    if (typeof localUserId === "string" && localUserId) {
      request.currentUserId = localUserId;
      return;
    }
  }

  return reply.code(401).send({ message: "Unauthorized" });
}
