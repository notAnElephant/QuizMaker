ALTER TABLE public.quizzes
  ADD COLUMN classic_mode boolean NOT NULL DEFAULT false,
  ADD COLUMN timer_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN timer_duration integer NOT NULL DEFAULT 2,
  ADD CONSTRAINT quizzes_timer_duration_positive CHECK (timer_duration > 0);
