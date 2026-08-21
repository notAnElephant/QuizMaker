CREATE TABLE "users" (
  "user_id" UUID NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "display_name" TEXT,
  "email" TEXT,
  CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

CREATE TABLE "quizzes" (
  "quiz_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "owner_id" UUID,
  "shared_user_ids" UUID[],
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "background_mode" TEXT NOT NULL DEFAULT 'preset',
  "background_preset" TEXT NOT NULL DEFAULT 'default',
  "background_image" TEXT,
  "text_color" TEXT NOT NULL DEFAULT '#24211c',
  "classic_mode" BOOLEAN NOT NULL DEFAULT false,
  "timer_enabled" BOOLEAN NOT NULL DEFAULT true,
  "timer_duration" INTEGER NOT NULL DEFAULT 2,
  CONSTRAINT "quizzes_pkey" PRIMARY KEY ("quiz_id"),
  CONSTRAINT "quizzes_background_mode_check" CHECK ("background_mode" IN ('preset', 'image')),
  CONSTRAINT "quizzes_background_preset_check" CHECK ("background_preset" IN ('default', 'sunset', 'forest', 'ocean')),
  CONSTRAINT "quizzes_text_color_check" CHECK ("text_color" ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT "quizzes_timer_duration_positive" CHECK ("timer_duration" > 0)
);

CREATE TABLE "questions" (
  "question_id" UUID NOT NULL,
  "quiz_id" UUID,
  "question_text" TEXT NOT NULL,
  "question_type" TEXT NOT NULL,
  "answer_options" TEXT[],
  "correct_answer" TEXT,
  "points" INTEGER DEFAULT 1000,
  "category_name" TEXT NOT NULL,
  "reveal_answer" BOOLEAN NOT NULL DEFAULT false,
  "answer_media_type" TEXT,
  "answer_media_source" TEXT,
  CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id"),
  CONSTRAINT "questions_answer_media_type_check" CHECK ("answer_media_type" IS NULL OR "answer_media_type" IN ('image', 'video', 'audio'))
);

CREATE TABLE "quiz_plays" (
  "play_id" UUID NOT NULL,
  "quiz_id" UUID,
  "user_id" UUID,
  "play_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "score" INTEGER DEFAULT 0,
  "team_name" TEXT,
  "team_score" INTEGER,
  "session_id" UUID NOT NULL,
  CONSTRAINT "quiz_plays_pkey" PRIMARY KEY ("play_id")
);

CREATE TABLE "answers" (
  "answer_id" UUID NOT NULL,
  "play_id" UUID,
  "question_id" UUID,
  "answer_text" TEXT NOT NULL,
  CONSTRAINT "answers_pkey" PRIMARY KEY ("answer_id")
);

CREATE INDEX "quiz_plays_session_id_idx" ON "quiz_plays"("session_id");

ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE CASCADE;
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE CASCADE;
ALTER TABLE "quiz_plays" ADD CONSTRAINT "quiz_plays_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE CASCADE;
ALTER TABLE "quiz_plays" ADD CONSTRAINT "quiz_plays_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE;
ALTER TABLE "answers" ADD CONSTRAINT "answers_play_id_fkey" FOREIGN KEY ("play_id") REFERENCES "quiz_plays"("play_id") ON DELETE CASCADE;
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE;
