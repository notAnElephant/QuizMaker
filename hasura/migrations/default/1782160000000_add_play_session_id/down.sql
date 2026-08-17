DROP INDEX IF EXISTS public.quiz_plays_session_id_idx;

ALTER TABLE public.quiz_plays
DROP COLUMN session_id;
