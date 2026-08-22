BEGIN;

CREATE TYPE "QuizShareRole" AS ENUM ('VIEWER', 'EDITOR');

CREATE TABLE "quiz_shares" (
  "quiz_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "role" "QuizShareRole" NOT NULL DEFAULT 'VIEWER',
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quiz_shares_pkey" PRIMARY KEY ("quiz_id", "user_id"),
  CONSTRAINT "quiz_shares_quiz_id_fkey"
    FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id")
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "quiz_shares_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("user_id")
    ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX "quiz_shares_user_id_idx" ON "quiz_shares"("user_id");

INSERT INTO "quiz_shares" ("quiz_id", "user_id", "role")
SELECT quiz."quiz_id", shared_user."user_id", 'VIEWER'::"QuizShareRole"
FROM "quizzes" AS quiz
CROSS JOIN LATERAL unnest(quiz."shared_user_ids") AS shared_user("user_id")
INNER JOIN "users" AS existing_user
  ON existing_user."user_id" = shared_user."user_id"
WHERE shared_user."user_id" IS DISTINCT FROM quiz."owner_id"
ON CONFLICT ("quiz_id", "user_id") DO NOTHING;

ALTER TABLE "quizzes" DROP COLUMN "shared_user_ids";

COMMIT;
