ALTER TABLE public.quizzes
ADD COLUMN background_mode text NOT NULL DEFAULT 'preset',
ADD COLUMN background_preset text NOT NULL DEFAULT 'default',
ADD COLUMN background_image text,
ADD COLUMN text_color text NOT NULL DEFAULT '#24211c';

ALTER TABLE public.quizzes
ADD CONSTRAINT quizzes_background_mode_check
CHECK (background_mode IN ('preset', 'image')),
ADD CONSTRAINT quizzes_background_preset_check
CHECK (background_preset IN ('default', 'sunset', 'forest', 'ocean')),
ADD CONSTRAINT quizzes_text_color_check
CHECK (text_color ~ '^#[0-9A-Fa-f]{6}$');
