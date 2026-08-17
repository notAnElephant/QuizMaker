BEGIN;

TRUNCATE TABLE public.answers, public.quiz_plays, public.questions, public.quizzes, public.users CASCADE;

INSERT INTO public.users (user_id, created_at, display_name, email) VALUES
  ('8d4ee02c-88d9-4608-9030-20726f7d702f', '2025-12-26 20:48:49.51972', 'Admin', 'admin@quizmaker.local'),
  ('2f781826-cd02-4a89-b17f-596d4ce4e421', '2025-12-27 09:12:31.11972', 'Szerkesztő', 'editor@quizmaker.local');

INSERT INTO public.quizzes (quiz_id, title, description, owner_id, shared_user_ids, created_at, updated_at) VALUES
  ('47559e6f-f126-4124-84d7-9d71d9467f6d', 'Vágó Pesta', 'Imported sample board quiz', '8d4ee02c-88d9-4608-9030-20726f7d702f', NULL, '2025-12-26 20:48:49.706971', '2025-12-26 20:48:49.706971'),
  ('6c246cef-3e6e-431c-92ec-8ff4c2f7f1ad', 'Saját teszt kvíz', 'Második minta a felhasználóváltás ellenőrzéséhez', '2f781826-cd02-4a89-b17f-596d4ce4e421', NULL, '2025-12-27 09:13:12.706971', '2025-12-27 09:13:12.706971');

INSERT INTO public.questions (question_id, quiz_id, question_text, question_type, answer_options, correct_answer, points, category_name) VALUES
  ('e60a0756-d789-48b1-bb48-10bc36e766b4', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai1.jpg]', 'image', '{}', NULL, 1000, 'Éjáj'),
  ('ab031b84-78ce-4e8a-a4e9-fcb42df70ecc', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai2.jpg]', 'image', '{}', NULL, 2000, 'Éjáj'),
  ('4b35d0aa-f697-4723-a31f-a3fee19f2182', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai3.jpg]', 'image', '{}', NULL, 3000, 'Éjáj'),
  ('9a884529-2207-4e13-bb3f-45936dceb2dd', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai4.jpg]', 'image', '{}', NULL, 4000, 'Éjáj'),
  ('5c8ce8e8-95cf-4334-8b41-d2d4854dc6f9', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település látható a képen? [SOURCE: /assets/ai5.jpg]', 'image', '{}', NULL, 5000, 'Éjáj'),
  ('0d2c39ba-d1f8-4e17-9892-db1145eefbb6', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{lépcső,udvar,puszta,elágazás,körtér,mellékút}', NULL, 1000, 'Közs területt'),
  ('ca2efdd8-daae-440c-8d1f-a4f044f247dd', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{lépcsősor,gyársor,házsor,villasor,határsor,kertsor}', NULL, 2000, 'Közs területt'),
  ('4d63f188-b0b4-4052-b50c-df28ba578d8f', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{sikátor,zug,barlang,vár,csapás,part}', NULL, 3000, 'Közs területt'),
  ('5ca3bfb0-ff38-4de3-9e92-90b046e57104', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{tető,dűlő,utcza,szektor,üdülőpart,körforgalom}', NULL, 4000, 'Közs területt'),
  ('72694c5f-5dbf-486f-98f3-82cb19c076d7', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Az alábbi hat közterület-jelleg közül melyik az a kettő, amelyik nem létezik Magyarországon?', 'text', '{major,tere,járda,lagúna,liget,negyed}', NULL, 5000, 'Közs területt'),
  ('8ebd7f31-66cf-4f1c-9731-b0c69228b87c', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település van az alábbiak közül Magyarország területén?', 'text', '{Mákfalva,Tiszakarácsonyfalva,Kisjakabfalva,Küküllőkeményfalva}', NULL, 1000, 'Mutsarötsöge'),
  ('c062db9f-33b9-4ff8-a73e-387df6b441b6', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település van az alábbiak közül Magyarország területén?', 'text', '{Monyorókerék,Fugyivásárhely,Kakáktelep,Egyházasdengeleg}', NULL, 2000, 'Mutsarötsöge'),
  ('dd45261c-4244-4585-bdd5-59daa37c2648', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település van az alábbiak közül Magyarország területén?', 'text', '{Chernelházadamonya,Magyarkapus,Bojt,Göcs}', NULL, 3000, 'Mutsarötsöge'),
  ('39004d27-e997-4fc0-9f75-876e023cd858', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik település van az alábbiak közül Európa területén?', 'text', '{Ribi,Bré,Pina,Tanga}', NULL, 4000, 'Mutsarötsöge'),
  ('0d1834aa-528d-4604-ad07-6e9a9e60eb66', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Melyik településnek van az alábbiak közül magyar vonatkozása?', 'text', '{Rum,Söre,Borod}', NULL, 5000, 'Mutsarötsöge'),
  ('75fb8d7c-ac4e-4b6b-8cb6-735063fde4d0', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Hány karakterből áll a leghosszabb európai település neve?', 'text', '{}', NULL, 1000, 'Nemmkelidearabzám'),
  ('e182927a-5c42-43cd-8494-f7e21511576d', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Mennyi idő végiggyalogolni a Földön a két legtávolabbi pont közt megtehető legrövidebb utat a Google Maps szerint?', 'text', '{}', NULL, 2000, 'Nemmkelidearabzám'),
  ('228266bb-11e6-4a65-a582-7e92da169250', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Hány olyan tó van, ami egy olyan szigeten van, ami egy olyan tavon van, ami egy olyan szigeten van, ami egy tavon van?', 'text', '{}', NULL, 3000, 'Nemmkelidearabzám'),
  ('fb2ed521-5b10-46de-b4d1-481175ac55fa', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Hány nyelvet beszélnek abban az országban, ahol a világon a legtöbbet beszélik?', 'text', '{}', NULL, 4000, 'Nemmkelidearabzám'),
  ('5b010908-d2f6-47d6-bf30-cdbc1934d06d', '47559e6f-f126-4124-84d7-9d71d9467f6d', 'Hány szóból áll Bangkok neve?', 'text', '{}', NULL, 5000, 'Nemmkelidearabzám'),
  ('6b470172-4f5e-420a-a3f8-86ae5484d8f5', '6c246cef-3e6e-431c-92ec-8ff4c2f7f1ad', 'Melyik város a magyar főváros?', 'text', '{Budapest,Szeged,Debrecen,Pécs}', NULL, 1000, 'Gyors kör');

INSERT INTO public.quiz_plays (play_id, session_id, quiz_id, user_id, play_time, score, team_name, team_score) VALUES
  ('dcf876e0-9ce2-4d1e-a1df-f226c6aef101', '7fe8f336-d58b-4802-844b-cc3b7415fa99', '47559e6f-f126-4124-84d7-9d71d9467f6d', '8d4ee02c-88d9-4608-9030-20726f7d702f', '2025-12-26 21:15:00', 7000, 'Team 1', 7000),
  ('d7475c88-841a-4095-8e77-3985fbed80c1', '7fe8f336-d58b-4802-844b-cc3b7415fa99', '47559e6f-f126-4124-84d7-9d71d9467f6d', '8d4ee02c-88d9-4608-9030-20726f7d702f', '2025-12-26 21:15:00', 5000, 'Team 2', 5000);

COMMIT;
