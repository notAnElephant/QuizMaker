ALTER TABLE public.quizzes
DROP CONSTRAINT IF EXISTS quizzes_text_color_check,
DROP CONSTRAINT IF EXISTS quizzes_background_preset_check,
DROP CONSTRAINT IF EXISTS quizzes_background_mode_check,
DROP COLUMN IF EXISTS text_color,
DROP COLUMN IF EXISTS background_image,
DROP COLUMN IF EXISTS background_preset,
DROP COLUMN IF EXISTS background_mode;
