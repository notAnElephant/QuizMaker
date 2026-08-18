ALTER TABLE public.questions
  DROP CONSTRAINT IF EXISTS questions_answer_media_type_check,
  DROP COLUMN IF EXISTS answer_media_source,
  DROP COLUMN IF EXISTS answer_media_type,
  DROP COLUMN IF EXISTS reveal_answer;
