import { type Static, Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Prisma } from "../generated/prisma/index.js";
import { authenticate } from "../auth.js";
import { prisma } from "../database.js";
import { editableQuizWhere } from "../quizAccess.js";

const quizParamsSchema = Type.Object({
  quizId: Type.String({ format: "uuid" }),
});
const quizShareParamsSchema = Type.Object({
  quizId: Type.String({ format: "uuid" }),
  userId: Type.String({ format: "uuid" }),
});
const quizShareBodySchema = Type.Object({
  email: Type.String({ minLength: 3, maxLength: 320 }),
  role: Type.Optional(Type.Literal("VIEWER")),
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
  owner: {
    select: { display_name: true, email: true, user_id: true },
  },
  owner_id: true,
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
  shares: {
    select: { role: true, user_id: true },
  },
  text_color: true,
  timer_duration: true,
  timer_enabled: true,
  title: true,
  updated_at: true,
});

type SelectedQuiz = Prisma.QuizGetPayload<{ select: typeof quizSelect }>;

function serializeQuiz(quiz: SelectedQuiz, currentUserId: string) {
  const { owner_id, shares, ...serializedQuiz } = quiz;
  const accessRole =
    owner_id === currentUserId
      ? "OWNER"
      : (shares.find((share) => share.user_id === currentUserId)?.role ??
        "VIEWER");

  return { ...serializedQuiz, access_role: accessRole };
}

function questionRows(questions: (typeof questionSchema)["static"][]) {
  return questions.map((question) => ({ ...question }));
}

export const quizRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.addHook("preHandler", authenticate);

  app.get("/quizzes", async (request) => {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { updated_at: "desc" },
      select: quizSelect,
      where: {
        OR: [
          { owner_id: request.currentUserId },
          { shares: { some: { user_id: request.currentUserId } } },
        ],
      },
    });

    return {
      quizzes: quizzes.map((quiz) =>
        serializeQuiz(quiz, request.currentUserId),
      ),
    };
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

      return reply
        .code(201)
        .send({ quiz: serializeQuiz(createdQuiz, request.currentUserId) });
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
        where: editableQuizWhere(params.quizId, request.currentUserId),
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

      return { quiz: serializeQuiz(updatedQuiz, request.currentUserId) };
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

  app.get(
    "/quizzes/:quizId/shares",
    { schema: { params: quizParamsSchema } },
    async (request, reply) => {
      const params = request.params as Static<typeof quizParamsSchema>;
      const quiz = await prisma.quiz.findFirst({
        select: {
          shares: {
            orderBy: { created_at: "asc" },
            select: {
              created_at: true,
              role: true,
              user: {
                select: { display_name: true, email: true, user_id: true },
              },
            },
          },
        },
        where: {
          owner_id: request.currentUserId,
          quiz_id: params.quizId,
        },
      });

      if (!quiz) {
        return reply.code(404).send({ message: "Quiz not found" });
      }

      return { shares: quiz.shares };
    },
  );

  app.post(
    "/quizzes/:quizId/shares",
    {
      schema: { body: quizShareBodySchema, params: quizParamsSchema },
    },
    async (request, reply) => {
      const body = request.body as Static<typeof quizShareBodySchema>;
      const params = request.params as Static<typeof quizParamsSchema>;
      const quiz = await prisma.quiz.findFirst({
        select: { quiz_id: true },
        where: {
          owner_id: request.currentUserId,
          quiz_id: params.quizId,
        },
      });

      if (!quiz) {
        return reply.code(404).send({ message: "Quiz not found" });
      }

      const recipients = await prisma.user.findMany({
        select: { display_name: true, email: true, user_id: true },
        take: 2,
        where: {
          email: { equals: body.email.trim(), mode: "insensitive" },
        },
      });

      if (!recipients.length) {
        return reply.code(404).send({ message: "User not found" });
      }
      if (recipients.length > 1) {
        return reply.code(409).send({ message: "Email is not unique" });
      }

      const recipient = recipients[0];
      if (recipient.user_id === request.currentUserId) {
        return reply
          .code(400)
          .send({ message: "You cannot share a quiz with yourself" });
      }

      const share = await prisma.quizShare.upsert({
        create: {
          quiz_id: params.quizId,
          role: "VIEWER",
          user_id: recipient.user_id,
        },
        select: { created_at: true, role: true },
        update: { role: "VIEWER" },
        where: {
          quiz_id_user_id: {
            quiz_id: params.quizId,
            user_id: recipient.user_id,
          },
        },
      });

      return reply.code(201).send({
        share: { ...share, user: recipient },
      });
    },
  );

  app.delete(
    "/quizzes/:quizId/shares/:userId",
    { schema: { params: quizShareParamsSchema } },
    async (request, reply) => {
      const params = request.params as Static<typeof quizShareParamsSchema>;
      const quiz = await prisma.quiz.findFirst({
        select: { quiz_id: true },
        where: {
          owner_id: request.currentUserId,
          quiz_id: params.quizId,
        },
      });

      if (!quiz) {
        return reply.code(404).send({ message: "Quiz not found" });
      }

      const result = await prisma.quizShare.deleteMany({
        where: { quiz_id: params.quizId, user_id: params.userId },
      });

      if (!result.count) {
        return reply.code(404).send({ message: "Share not found" });
      }

      return reply.code(204).send();
    },
  );
};
