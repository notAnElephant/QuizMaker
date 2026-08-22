import type { Prisma } from "./generated/prisma/index.js";

export function readableQuizWhere(
  quizId: string,
  userId: string,
): Prisma.QuizWhereInput {
  return {
    OR: [{ owner_id: userId }, { shares: { some: { user_id: userId } } }],
    quiz_id: quizId,
  };
}

export function editableQuizWhere(
  quizId: string,
  userId: string,
): Prisma.QuizWhereInput {
  return {
    OR: [
      { owner_id: userId },
      { shares: { some: { role: "EDITOR", user_id: userId } } },
    ],
    quiz_id: quizId,
  };
}
