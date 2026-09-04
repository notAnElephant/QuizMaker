import { type Static, Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Prisma } from "../generated/prisma/index.js";
import { authenticate } from "../auth.js";
import { prisma } from "../database.js";
import { editableQuizWhere } from "../quizAccess.js";
import { normalizeEmail, sendQuizInvitationEmail } from "../quizInvitations.js";

const quizParamsSchema = Type.Object({
  quizId: Type.String({ format: "uuid" }),
});
const quizShareParamsSchema = Type.Object({
  quizId: Type.String({ format: "uuid" }),
  userId: Type.String({ format: "uuid" }),
});
const quizShareBodySchema = Type.Object({
  email: Type.String({ minLength: 3, maxLength: 320 }),
  role: Type.Union([Type.Literal("VIEWER"), Type.Literal("EDITOR")]),
});
const quizShareRoleSchema = Type.Union([
  Type.Literal("VIEWER"),
  Type.Literal("EDITOR"),
]);
const quizShareUpdateBodySchema = Type.Object({ role: quizShareRoleSchema });
const quizInvitationParamsSchema = Type.Object({
  invitationId: Type.String({ format: "uuid" }),
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
          invitations: {
            orderBy: { created_at: "asc" },
            select: {
              created_at: true,
              delivery_status: true,
              email: true,
              invitation_id: true,
              role: true,
            },
          },
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

      return { invitations: quiz.invitations, shares: quiz.shares };
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
      const email = normalizeEmail(body.email);
      const quiz = await prisma.quiz.findFirst({
        select: { quiz_id: true, title: true },
        where: {
          owner_id: request.currentUserId,
          quiz_id: params.quizId,
        },
      });

      if (!quiz) {
        return reply.code(404).send({ message: "Quiz not found" });
      }

      if (
        request.currentUserEmailVerified &&
        request.currentUserEmail &&
        email === normalizeEmail(request.currentUserEmail)
      ) {
        return reply
          .code(400)
          .send({ message: "You cannot share a quiz with yourself" });
      }

      const recipients = await prisma.user.findMany({
        select: { display_name: true, email: true, user_id: true },
        take: 2,
        where: {
          email: { equals: email, mode: "insensitive" },
        },
      });

      if (recipients.length > 1) {
        return reply.code(409).send({ message: "Email is not unique" });
      }

      const recipient = recipients[0];
      if (recipient?.user_id === request.currentUserId) {
        return reply
          .code(400)
          .send({ message: "You cannot share a quiz with yourself" });
      }

      if (recipient) {
        const share = await prisma.$transaction(async (transaction) => {
          await transaction.quizInvitation.deleteMany({
            where: { email, quiz_id: params.quizId },
          });
          return transaction.quizShare.upsert({
            create: {
              quiz_id: params.quizId,
              role: body.role,
              user_id: recipient.user_id,
            },
            select: { created_at: true, role: true },
            update: { role: body.role },
            where: {
              quiz_id_user_id: {
                quiz_id: params.quizId,
                user_id: recipient.user_id,
              },
            },
          });
        });

        return reply.code(201).send({
          outcome: "SHARED",
          share: { ...share, user: recipient },
        });
      }

      const invitation = await prisma.quizInvitation.upsert({
        create: { email, quiz_id: params.quizId, role: body.role },
        update: { role: body.role },
        where: { quiz_id_email: { email, quiz_id: params.quizId } },
      });
      const owner = await prisma.user.findUnique({
        select: { display_name: true },
        where: { user_id: request.currentUserId },
      });

      try {
        const resendMessageId = await sendQuizInvitationEmail({
          deliveryKey: invitation.delivery_key,
          email: invitation.email,
          inviterName: owner?.display_name ?? null,
          quizTitle: quiz.title,
          role: invitation.role,
        });
        const sentInvitation = await prisma.quizInvitation.update({
          data: {
            delivery_status: "SENT",
            resend_message_id: resendMessageId,
          },
          where: { invitation_id: invitation.invitation_id },
        });
        return reply.code(201).send({
          invitation: sentInvitation,
          outcome: "INVITED",
        });
      } catch (error) {
        request.log.error(error, "Quiz invitation email delivery failed");
        const failedInvitation = await prisma.quizInvitation.update({
          data: { delivery_status: "FAILED" },
          where: { invitation_id: invitation.invitation_id },
        });
        return reply.code(201).send({
          invitation: failedInvitation,
          outcome: "INVITATION_DELIVERY_FAILED",
        });
      }
    },
  );

  app.patch(
    "/quizzes/:quizId/shares/:userId",
    {
      schema: {
        body: quizShareUpdateBodySchema,
        params: quizShareParamsSchema,
      },
    },
    async (request, reply) => {
      const body = request.body as Static<typeof quizShareUpdateBodySchema>;
      const params = request.params as Static<typeof quizShareParamsSchema>;
      const result = await prisma.quizShare.updateMany({
        data: { role: body.role },
        where: {
          quiz_id: params.quizId,
          user_id: params.userId,
          quiz: { owner_id: request.currentUserId },
        },
      });

      if (!result.count) {
        return reply.code(404).send({ message: "Share not found" });
      }

      return { updated: true };
    },
  );

  app.patch(
    "/quizzes/:quizId/invitations/:invitationId",
    {
      schema: {
        body: quizShareUpdateBodySchema,
        params: quizInvitationParamsSchema,
      },
    },
    async (request, reply) => {
      const body = request.body as Static<typeof quizShareUpdateBodySchema>;
      const params = request.params as Static<
        typeof quizInvitationParamsSchema
      >;
      const result = await prisma.quizInvitation.updateMany({
        data: { role: body.role },
        where: {
          invitation_id: params.invitationId,
          quiz_id: params.quizId,
          quiz: { owner_id: request.currentUserId },
        },
      });

      if (!result.count) {
        return reply.code(404).send({ message: "Invitation not found" });
      }

      return { updated: true };
    },
  );

  app.post(
    "/quizzes/:quizId/invitations/:invitationId/resend",
    { schema: { params: quizInvitationParamsSchema } },
    async (request, reply) => {
      const params = request.params as Static<
        typeof quizInvitationParamsSchema
      >;
      const invitation = await prisma.quizInvitation.findFirst({
        select: {
          email: true,
          invitation_id: true,
          quiz: { select: { title: true } },
          role: true,
        },
        where: {
          invitation_id: params.invitationId,
          quiz_id: params.quizId,
          quiz: { owner_id: request.currentUserId },
        },
      });

      if (!invitation) {
        return reply.code(404).send({ message: "Invitation not found" });
      }

      const owner = await prisma.user.findUnique({
        select: { display_name: true },
        where: { user_id: request.currentUserId },
      });
      const deliveryKey = crypto.randomUUID();

      try {
        const resendMessageId = await sendQuizInvitationEmail({
          deliveryKey,
          email: invitation.email,
          inviterName: owner?.display_name ?? null,
          quizTitle: invitation.quiz.title,
          role: invitation.role,
        });
        await prisma.quizInvitation.update({
          data: {
            delivery_key: deliveryKey,
            delivery_status: "SENT",
            resend_message_id: resendMessageId,
          },
          where: { invitation_id: invitation.invitation_id },
        });
        return { resent: true };
      } catch (error) {
        request.log.error(error, "Quiz invitation email resend failed");
        await prisma.quizInvitation.update({
          data: { delivery_status: "FAILED" },
          where: { invitation_id: invitation.invitation_id },
        });
        return reply
          .code(502)
          .send({ message: "Invitation email could not be sent" });
      }
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

  app.delete(
    "/quizzes/:quizId/invitations/:invitationId",
    { schema: { params: quizInvitationParamsSchema } },
    async (request, reply) => {
      const params = request.params as Static<
        typeof quizInvitationParamsSchema
      >;
      const result = await prisma.quizInvitation.deleteMany({
        where: {
          invitation_id: params.invitationId,
          quiz_id: params.quizId,
          quiz: { owner_id: request.currentUserId },
        },
      });

      if (!result.count) {
        return reply.code(404).send({ message: "Invitation not found" });
      }

      return reply.code(204).send();
    },
  );
};
