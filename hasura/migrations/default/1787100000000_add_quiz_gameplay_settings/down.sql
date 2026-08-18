ALTER TABLE public.quizzes
  DROP CONSTRAINT quizzes_timer_duration_positive,
  DROP COLUMN timer_duration,
  DROP COLUMN timer_enabled,
  DROP COLUMN classic_mode;
