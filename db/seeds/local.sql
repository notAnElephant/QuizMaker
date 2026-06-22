BEGIN;

TRUNCATE TABLE public.answers, public.quiz_plays, public.questions, public.quizzes, public.users CASCADE;

INSERT INTO public.users (user_id, created_at, display_name, email) VALUES
  ('8d4ee02c-88d9-4608-9030-20726f7d702f', '2025-12-26 20:48:49.51972', 'Admin', NULL);

INSERT INTO public.quizzes (quiz_id, title, description, owner_id, shared_user_ids, created_at, updated_at) VALUES
  ('47559e6f-f126-4124-84d7-9d71d9467f6d', 'Éjáj', NULL, '8d4ee02c-88d9-4608-9030-20726f7d702f', NULL, '2025-12-26 20:48:49.706971', '2025-12-26 20:48:49.706971'),
  ('1e369596-261b-418b-bb23-3c68dee51ac7', 'Közs területt', NULL, '8d4ee02c-88d9-4608-9030-20726f7d702f', NULL, '2025-12-26 20:48:50.820853', '2025-12-26 20:48:50.820853'),
  ('19be23a0-3132-49db-8595-3437b688fd83', 'Mutsarötsöge', NULL, '8d4ee02c-88d9-4608-9030-20726f7d702f', NULL, '2025-12-26 20:48:51.99168', '2025-12-26 20:48:51.99168'),
  ('df47877a-0337-4925-987c-fcc9a617aa67', 'Nemmkelidearabzám', NULL, '8d4ee02c-88d9-4608-9030-20726f7d702f', NULL, '2025-12-26 20:48:53.120143', '2025-12-26 20:48:53.120143');

INSERT INTO public.questions (question_id, quiz_id, question_text, question_type, answer_options, correct_answer, points) VALUES
  ('e60a0756-d789-48b1-bb48-10bc36e766b4', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai1.jpg]', 'image', '{}', NULL, 1000),
  ('ab031b84-78ce-4e8a-a4e9-fcb42df70ecc', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai2.jpg]', 'image', '{}', NULL, 2000),
  ('4b35d0aa-f697-4723-a31f-a3fee19f2182', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai3.jpg]', 'image', '{}', NULL, 3000),
  ('9a884529-2207-4e13-bb3f-45936dceb2dd', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai4.jpg]', 'image', '{}', NULL, 4000),
  ('5c8ce8e8-95cf-4334-8b41-d2d4854dc6f9', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai5.jpg]', 'image', '{}', NULL, 5000),
  ('0d2c39ba-d1f8-4e17-9892-db1145eefbb6', '1e369596-261b-418b-bb23-3c68dee51ac7', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{lépcső,udvar,puszta,elágazás,körtér,mellékút}', NULL, 1000),
  ('ca2efdd8-daae-440c-8d1f-a4f044f247dd', '1e369596-261b-418b-bb23-3c68dee51ac7', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{lépcsősor,gyársor,házsor,villasor,határsor,kertsor}', NULL, 2000),
  ('4d63f188-b0b4-4052-b50c-df28ba578d8f', '1e369596-261b-418b-bb23-3c68dee51ac7', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{sikátor,zug,barlang,vár,csapás,part}', NULL, 3000),
  ('5ca3bfb0-ff38-4de3-9e92-90b046e57104', '1e369596-261b-418b-bb23-3c68dee51ac7', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{tető,dűlő,utcza,szektor,üdülőpart,körforgalom}', NULL, 4000),
  ('72694c5f-5dbf-486f-98f3-82cb19c076d7', '1e369596-261b-418b-bb23-3c68dee51ac7', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{major,tere,járda,lagúna,liget,negyed}', NULL, 5000),
  ('8ebd7f31-66cf-4f1c-9731-b0c69228b87c', '19be23a0-3132-49db-8595-3437b688fd83', 'Melyik település van az alábbiak közül Magyarország területén?', 'text', '{Mákfalva,Tiszakarácsonyfalva,Kisjakabfalva,Küküllőkeményfalva}', NULL, 1000),
  ('c062db9f-33b9-4ff8-a73e-387df6b441b6', '19be23a0-3132-49db-8595-3437b688fd83', 'Melyik település van az alábbiak közül Magyarország területén?', 'text', '{Monyorókerék,Fugyivásárhely,Kakáktelep,Egyházasdengeleg}', NULL, 2000),
  ('dd45261c-4244-4585-bdd5-59daa37c2648', '19be23a0-3132-49db-8595-3437b688fd83', 'Melyik település van az alábbiak közül Magyarország területén?', 'text', '{Chernelházadamonya,Magyarkapus,Bojt,Göcs}', NULL, 3000),
  ('39004d27-e997-4fc0-9f75-876e023cd858', '19be23a0-3132-49db-8595-3437b688fd83', 'Melyik település van az alábbiak közül Európa területén?', 'text', '{Ribi,Bré,Pina,Tanga}', NULL, 4000),
  ('0d1834aa-528d-4604-ad07-6e9a9e60eb66', '19be23a0-3132-49db-8595-3437b688fd83', 'Melyik településnek van az alábbiak közül magyar vonatkozása?', 'text', '{Rum,Söre,Borod}', NULL, 5000),
  ('75fb8d7c-ac4e-4b6b-8cb6-735063fde4d0', 'df47877a-0337-4925-987c-fcc9a617aa67', 'Hány karakterből áll a leghosszabb európai település neve?', 'text', '{}', NULL, 1000),
  ('e182927a-5c42-43cd-8494-f7e21511576d', 'df47877a-0337-4925-987c-fcc9a617aa67', 'Mennyi idő végiggyalogolni a Földön a két legtávolabbi pont közt megtehető legrövidebb utat a Google Maps szerint?', 'text', '{}', NULL, 2000),
  ('228266bb-11e6-4a65-a582-7e92da169250', 'df47877a-0337-4925-987c-fcc9a617aa67', 'Hány olyan tó van, ami egy olyan szigeten van, ami egy olyan tavon van, ami egy olyan szigeten van, ami egy tavon van?', 'text', '{}', NULL, 3000),
  ('fb2ed521-5b10-46de-b4d1-481175ac55fa', 'df47877a-0337-4925-987c-fcc9a617aa67', 'Hány nyelvet beszélnek abban az országban, ahol a világon a legtöbbet beszélik?', 'text', '{}', NULL, 4000),
  ('5b010908-d2f6-47d6-bf30-cdbc1934d06d', 'df47877a-0337-4925-987c-fcc9a617aa67', 'Hány szóból áll Bangkok neve?', 'text', '{}', NULL, 5000);

COMMIT;
