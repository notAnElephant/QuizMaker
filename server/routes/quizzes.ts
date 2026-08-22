import { type Static, Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Prisma } from "@prisma/client";
import { authenticate } from "../auth.js";
import { prisma } from "../database.js";

const quizParamsSchema = Type.Object({
  quizId: Type.String({ format: "uuid" }),
});
const nullableString = Type.Union([Type.Null(), Type.String()]);
const questionSchema = Type.Object({
  answer_media_source: nullableString,
  answer_media_type: nullableString,
  answer_options: Type.Array(Type.String()),
  category_name: Type.String({ minLength: 1 }),
  correct_answer: nullableString,
  points: Type.Integer(),
  question_id: Type.String({ format: "uuid" }),
  question_text: Type.String(),
  question_type: Type.String(),
  reveal_answer: Type.Boolean(),
});
const quizBodySchema = Type.Object({
  background_image: nullableString,
  background_mode: Type.Union([Type.Literal("preset"), Type.Literal("image")]),
  background_preset: Type.Union([
    Type.Literal("default"),
    Type.Literal("sunset"),
    Type.Literal("forest"),
    Type.Literal("ocean"),
  ]),
  classic_mode: Type.Boolean(),
  description: nullableString,
  questions: Type.Array(questionSchema, { minItems: 1 }),
  text_color: Type.String({ pattern: "^#[0-9A-Fa-f]{6}$" }),
  timer_duration: Type.Integer({ minimum: 1 }),
  timer_enabled: Type.Boolean(),
  title: Type.String({ minLength: 1 }),
});
const createQuizBodySchema = Type.Intersect([
  quizBodySchema,
  Type.Object({ quiz_id: Type.String({ format: "uuid" }) }),
]);

const quizSelect = Prisma.validator<Prisma.QuizSelect>()({
  background_image: true,
  background_mode: true,
  background_preset: true,
  classic_mode: true,
  description: true,
  questions: {
    orderBy: [{ category_name: "asc" }, { points: "asc" }],
    select: {
      answer_media_source: true,
      answer_media_type: true,
      answer_options: true,
      category_name: true,
      correct_answer: true,
      points: true,
      question_id: true,
      question_text: true,
      question_type: true,
      reveal_answer: true,
    },
  },
  quiz_id: true,
  text_color: true,
  timer_duration: true,
  timer_enabled: true,
  title: true,
  updated_at: true,
});

function questionRows(questions: (typeof questionSchema)["static"][]) {
  return questions.map((question) => ({ ...question }));
}

export const quizRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.addHook("preHandler", authenticate);

  app.get("/quizzes", async (request) => {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { updated_at: "desc" },
      select: quizSelect,
      where: { owner_id: request.currentUserId },
    });

    return { quizzes };
  });

  app.post(
    "/quizzes",
    { schema: { body: createQuizBodySchema } },
    async (request, reply) => {
      const body = request.body as Static<typeof createQuizBodySchema>;
      const { questions, quiz_id, ...quiz } = body;
      const createdQuiz = await prisma.quiz.create({
        data: {
          ...quiz,
          owner_id: request.currentUserId,
          questions: { createMany: { data: questionRows(questions) } },
          quiz_id,
        },
        select: quizSelect,
      });

      return reply.code(201).send({ quiz: createdQuiz });
    },
  );

  app.put(
    "/quizzes/:quizId",
    { schema: { body: quizBodySchema, params: quizParamsSchema } },
    async (request, reply) => {
      const body = request.body as Static<typeof quizBodySchema>;
      const params = request.params as Static<typeof quizParamsSchema>;
      const existingQuiz = await prisma.quiz.findFirst({
        select: { quiz_id: true },
        where: {
          owner_id: request.currentUserId,
          quiz_id: params.quizId,
        },
      });

      if (!existingQuiz) {
        return reply.code(404).send({ message: "Quiz not found" });
      }

      const { questions, ...quiz } = body;
      const updatedQuiz = await prisma.$transaction(async (transaction) => {
        await transaction.question.deleteMany({
          where: { quiz_id: params.quizId },
        });
        return transaction.quiz.update({
          data: {
            ...quiz,
            questions: { createMany: { data: questionRows(questions) } },
            updated_at: new Date(),
          },
          select: quizSelect,
          where: { quiz_id: params.quizId },
        });
      });

      return { quiz: updatedQuiz };
    },
  );

  app.delete(
    "/quizzes/:quizId",
    { schema: { params: quizParamsSchema } },
    async (request, reply) => {
      const params = request.params as Static<typeof quizParamsSchema>;
      const result = await prisma.quiz.deleteMany({
        where: {
          owner_id: request.currentUserId,
          quiz_id: params.quizId,
        },
      });

      if (!result.count) {
        return reply.code(404).send({ message: "Quiz not found" });
      }

      return reply.code(204).send();
    },
  );
};
