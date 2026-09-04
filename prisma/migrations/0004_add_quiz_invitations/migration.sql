BEGIN;

CREATE TYPE "QuizInvitationDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TABLE "quiz_invitations" (
  "invitation_id" UUID NOT NULL,
  "quiz_id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "role" "QuizShareRole" NOT NULL DEFAULT 'VIEWER',
  "delivery_status" "QuizInvitationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "delivery_key" UUID NOT NULL,
  "resend_message_id" TEXT,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quiz_invitations_pkey" PRIMARY KEY ("invitation_id"),
  CONSTRAINT "quiz_invitations_quiz_id_fkey"
    FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id")
    ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "quiz_invitations_quiz_id_email_key"
  ON "quiz_invitations"("quiz_id", "email");
CREATE INDEX "quiz_invitations_email_idx" ON "quiz_invitations"("email");

COMMIT;
