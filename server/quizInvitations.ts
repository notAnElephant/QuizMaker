import { Resend } from "resend";
import type { Prisma, QuizShareRole } from "./generated/prisma/index.js";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function claimQuizInvitations(
  transaction: Prisma.TransactionClient,
  userId: string,
  email: string,
) {
  const invitations = await transaction.quizInvitation.findMany({
    select: { invitation_id: true, quiz_id: true, role: true },
    where: { email: normalizeEmail(email) },
  });

  for (const invitation of invitations) {
    await transaction.quizShare.upsert({
      create: {
        quiz_id: invitation.quiz_id,
        role: invitation.role,
        user_id: userId,
      },
      update: { role: invitation.role },
      where: {
        quiz_id_user_id: {
          quiz_id: invitation.quiz_id,
          user_id: userId,
        },
      },
    });
  }

  if (invitations.length) {
    await transaction.quizInvitation.deleteMany({
      where: {
        invitation_id: {
          in: invitations.map(({ invitation_id }) => invitation_id),
        },
      },
    });
  }

  return invitations.length;
}

type InvitationEmail = {
  deliveryKey: string;
  email: string;
  inviterName: string | null;
  quizTitle: string;
  role: QuizShareRole;
};

export async function sendQuizInvitationEmail({
  deliveryKey,
  email,
  inviterName,
  quizTitle,
  role,
}: InvitationEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const publicAppUrl = process.env.PUBLIC_APP_URL;

  if (!apiKey || !from || !publicAppUrl) {
    throw new Error("Quiz invitation email is not configured");
  }

  const quizUrl = new URL("/quizzes", publicAppUrl).toString();
  const roleLabel = role === "EDITOR" ? "szerkesztői" : "megtekintői";
  const inviter = inviterName?.trim() || "Egy QuizMaker felhasználó";
  const text = `${inviter} ${roleLabel} hozzáférést adott neked a(z) „${quizTitle}” kvízhez. Jelentkezz be az alábbi címen a meghívott e-mail-címmel: ${quizUrl}`;
  const html = `<p><strong>${escapeHtml(inviter)}</strong> ${roleLabel} hozzáférést adott neked a(z) <strong>„${escapeHtml(quizTitle)}”</strong> kvízhez.</p><p>Jelentkezz be a meghívott e-mail-címmel a hozzáférés aktiválásához.</p><p><a href="${escapeHtml(quizUrl)}">Kvízeim megnyitása</a></p>`;
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from,
      html,
      subject: `Meghívó a(z) „${quizTitle}” kvízhez`,
      text,
      to: [email],
    },
    { idempotencyKey: `quiz-invitation/${deliveryKey}` },
  );

  if (error) {
    throw new Error("Quiz invitation email delivery failed");
  }

  return data?.id ?? null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}
