import { type Static, Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticate, isLocalAuthEnabled } from "../auth.js";
import { prisma } from "../database.js";
import { claimQuizInvitations, normalizeEmail } from "../quizInvitations.js";

const userBodySchema = Type.Object({
  display_name: Type.Union([Type.Null(), Type.String()]),
  email: Type.Union([Type.Null(), Type.String()]),
});

export const userRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get("/users", async (_request, reply) => {
    if (!isLocalAuthEnabled) {
      return reply.code(403).send({ message: "Local users are disabled" });
    }

    const users = await prisma.user.findMany({
      orderBy: [{ display_name: "asc" }, { created_at: "asc" }],
      select: { display_name: true, email: true, user_id: true },
    });

    return { users };
  });

  app.put(
    "/users/me",
    { preHandler: authenticate, schema: { body: userBodySchema } },
    async (request) => {
      const body = request.body as Static<typeof userBodySchema>;
      const verifiedEmail = request.currentUserEmailVerified
        ? request.currentUserEmail
        : undefined;
      const email = verifiedEmail ?? (isLocalAuthEnabled ? body.email : null);
      const user = await prisma.$transaction(async (transaction) => {
        const syncedUser = await transaction.user.upsert({
          create: {
            display_name: body.display_name,
            email,
            user_id: request.currentUserId,
          },
          update: {
            display_name: body.display_name,
            email,
          },
          where: { user_id: request.currentUserId },
          select: { display_name: true, email: true, user_id: true },
        });

        if (verifiedEmail) {
          await claimQuizInvitations(
            transaction,
            request.currentUserId,
            normalizeEmail(verifiedEmail),
          );
        }

        return syncedUser;
      });

      return { user };
    },
  );
};
