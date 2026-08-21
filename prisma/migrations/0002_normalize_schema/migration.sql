BEGIN;

UPDATE "quizzes" SET "shared_user_ids" = '{}' WHERE "shared_user_ids" IS NULL;
ALTER TABLE "quizzes" ALTER COLUMN "shared_user_ids" SET DEFAULT '{}';
ALTER TABLE "quizzes" ALTER COLUMN "shared_user_ids" SET NOT NULL;

UPDATE "questions" SET "answer_options" = '{}' WHERE "answer_options" IS NULL;
ALTER TABLE "questions" ALTER COLUMN "answer_options" SET DEFAULT '{}';
ALTER TABLE "questions" ALTER COLUMN "answer_options" SET NOT NULL;

UPDATE "questions" SET "category_name" = 'Uncategorized' WHERE "category_name" IS NULL;
ALTER TABLE "questions" ALTER COLUMN "category_name" SET NOT NULL;

ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "classic_mode" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "timer_enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "timer_duration" INTEGER NOT NULL DEFAULT 2;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'quizzes_timer_duration_positive'
      AND conrelid = 'quizzes'::regclass
  ) THEN
    ALTER TABLE "quizzes"
      ADD CONSTRAINT "quizzes_timer_duration_positive" CHECK ("timer_duration" > 0);
  END IF;
END
$$;

COMMIT;
