UPDATE public.quizzes
SET title = 'Vágó Pesta',
    description = 'Imported sample board quiz',
    updated_at = NOW()
WHERE quiz_id = '47559e6f-f126-4124-84d7-9d71d9467f6d';

UPDATE public.questions
SET quiz_id = '47559e6f-f126-4124-84d7-9d71d9467f6d'
WHERE quiz_id IN (
  '1e369596-261b-418b-bb23-3c68dee51ac7',
  '19be23a0-3132-49db-8595-3437b688fd83',
  'df47877a-0337-4925-987c-fcc9a617aa67'
);

DELETE FROM public.quizzes
WHERE quiz_id IN (
  '1e369596-261b-418b-bb23-3c68dee51ac7',
  '19be23a0-3132-49db-8595-3437b688fd83',
  'df47877a-0337-4925-987c-fcc9a617aa67'
);
