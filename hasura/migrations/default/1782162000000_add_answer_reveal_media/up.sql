ALTER TABLE public.questions
  ADD COLUMN reveal_answer boolean NOT NULL DEFAULT false,
  ADD COLUMN answer_media_type text,
  ADD COLUMN answer_media_source text;

ALTER TABLE public.questions
  ADD CONSTRAINT questions_answer_media_type_check
  CHECK (
    answer_media_type IS NULL
    OR answer_media_type IN ('image', 'video', 'audio')
  );
