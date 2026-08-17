ALTER TABLE public.quiz_plays
ADD COLUMN session_id uuid;

UPDATE public.quiz_plays
SET session_id = play_id
WHERE session_id IS NULL;

ALTER TABLE public.quiz_plays
ALTER COLUMN session_id SET NOT NULL;

CREATE INDEX quiz_plays_session_id_idx
ON public.quiz_plays (session_id);
