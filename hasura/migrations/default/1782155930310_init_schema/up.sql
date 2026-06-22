\restrict hasura
SET check_function_bodies = false;
CREATE TABLE public.answers (
    answer_id uuid NOT NULL,
    play_id uuid,
    question_id uuid,
    answer_text text NOT NULL
);
CREATE TABLE public.questions (
    question_id uuid NOT NULL,
    quiz_id uuid,
    question_text text NOT NULL,
    question_type text NOT NULL,
    answer_options text[],
    correct_answer text,
    points integer DEFAULT 1000
);
CREATE TABLE public.quiz_plays (
    play_id uuid NOT NULL,
    quiz_id uuid,
    user_id uuid,
    play_time timestamp without time zone DEFAULT now() NOT NULL,
    score integer DEFAULT 0,
    team_name text,
    team_score integer
);
CREATE TABLE public.quizzes (
    quiz_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    owner_id uuid,
    shared_user_ids uuid[],
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.users (
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    display_name text,
    email text
);
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (answer_id);
ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);
ALTER TABLE ONLY public.quiz_plays
    ADD CONSTRAINT quiz_plays_pkey PRIMARY KEY (play_id);
ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (quiz_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_play_id_fkey FOREIGN KEY (play_id) REFERENCES public.quiz_plays(play_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(question_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.quiz_plays
    ADD CONSTRAINT quiz_plays_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.quiz_plays
    ADD CONSTRAINT quiz_plays_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
\unrestrict hasura
