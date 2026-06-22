INSERT INTO public.quizzes (
  quiz_id,
  title,
  description,
  owner_id,
  shared_user_ids,
  created_at,
  updated_at
)
VALUES
  ('1e369596-261b-418b-bb23-3c68dee51ac7', 'Közs területt', NULL, '8d4ee02c-88d9-4608-9030-20726f7d702f', NULL, '2025-12-26 20:48:50.820853', '2025-12-26 20:48:50.820853'),
  ('19be23a0-3132-49db-8595-3437b688fd83', 'Mutsarötsöge', NULL, '8d4ee02c-88d9-4608-9030-20726f7d702f', NULL, '2025-12-26 20:48:51.99168', '2025-12-26 20:48:51.99168'),
  ('df47877a-0337-4925-987c-fcc9a617aa67', 'Nemmkelidearabzám', NULL, '8d4ee02c-88d9-4608-9030-20726f7d702f', NULL, '2025-12-26 20:48:53.120143', '2025-12-26 20:48:53.120143')
ON CONFLICT (quiz_id) DO NOTHING;

UPDATE public.quizzes
SET title = 'Éjáj',
    description = NULL,
    updated_at = '2025-12-26 20:48:49.706971'
WHERE quiz_id = '47559e6f-f126-4124-84d7-9d71d9467f6d';

UPDATE public.questions
SET quiz_id = CASE category_name
  WHEN 'Éjáj' THEN '47559e6f-f126-4124-84d7-9d71d9467f6d'
  WHEN 'Közs területt' THEN '1e369596-261b-418b-bb23-3c68dee51ac7'
  WHEN 'Mutsarötsöge' THEN '19be23a0-3132-49db-8595-3437b688fd83'
  WHEN 'Nemmkelidearabzám' THEN 'df47877a-0337-4925-987c-fcc9a617aa67'
  ELSE quiz_id
END
WHERE quiz_id = '47559e6f-f126-4124-84d7-9d71d9467f6d';
