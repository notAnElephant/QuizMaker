import { type Static, Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticate } from "../auth.js";
import { prisma } from "../database.js";

const playSessionSchema = Type.Object({
  played_at: Type.String({ format: "date-time" }),
  plays: Type.Array(
    Type.Object({
      play_id: Type.String({ format: "uuid" }),
      score: Type.Integer(),
      team_name: Type.Union([Type.Null(), Type.String()]),
      team_score: Type.Integer(),
    }),
    { minItems: 1 },
  ),
  quiz_id: Type.String({ format: "uuid" }),
  session_id: Type.String({ format: "uuid" }),
});

export const playSessionRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/play-sessions",
    { preHandler: authenticate, schema: { body: playSessionSchema } },
    async (request, reply) => {
      const body = request.body as Static<typeof playSessionSchema>;
      const quiz = await prisma.quiz.findFirst({
        select: { quiz_id: true },
        where: {
          owner_id: request.currentUserId,
          quiz_id: body.quiz_id,
        },
      });

      if (!quiz) {
        return reply.code(404).send({ message: "Quiz not found" });
      }

      const playTime = new Date(body.played_at);
      const result = await prisma.quizPlay.createMany({
        data: body.plays.map((play) => ({
          ...play,
          play_time: playTime,
          quiz_id: body.quiz_id,
          session_id: body.session_id,
          user_id: request.currentUserId,
        })),
      });

      return reply.code(201).send({ saved: result.count });
    },
  );
};
