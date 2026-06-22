ALTER TABLE public.questions
ADD COLUMN category_name text NOT NULL DEFAULT '';

UPDATE public.questions AS questions
SET category_name = quizzes.title
FROM public.quizzes AS quizzes
WHERE questions.quiz_id = quizzes.quiz_id
  AND questions.category_name = '';

ALTER TABLE public.questions
ALTER COLUMN category_name DROP DEFAULT;
