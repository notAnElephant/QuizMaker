import type { QuizAppearance } from "../context/types";

export type ApiUser = {
  display_name?: string | null;
  email?: string | null;
  user_id: string;
};

export type QuizAccessRole = "EDITOR" | "OWNER" | "VIEWER";

export type QuizShare = {
  created_at: string;
  role: "EDITOR" | "VIEWER";
  user: ApiUser;
};

export type QuizInvitation = {
  created_at: string;
  delivery_status: "FAILED" | "PENDING" | "SENT";
  email: string;
  invitation_id: string;
  role: "EDITOR" | "VIEWER";
};

export type QuizShareRole = QuizShare["role"];

export type SavedQuizQuestion = {
  answer_options: string[];
  answer_media_source?: string | null;
  answer_media_type?: string | null;
  category_name: string;
  correct_answer?: string | null;
  points?: number | null;
  question_id: string;
  question_text: string;
  question_type: string;
  reveal_answer: boolean;
};

export type SavedQuiz = {
  access_role: QuizAccessRole;
  background_image?: string | null;
  background_mode: QuizAppearance["backgroundMode"];
  background_preset: QuizAppearance["backgroundPreset"];
  classic_mode: boolean;
  description?: string | null;
  owner: ApiUser | null;
  questions: SavedQuizQuestion[];
  quiz_id: string;
  text_color: string;
  timer_duration: number;
  timer_enabled: boolean;
  title: string;
  updated_at: string;
};

export type QuizInput = Omit<
  SavedQuiz,
  "access_role" | "owner" | "quiz_id" | "updated_at"
>;

export type PlaySessionInput = {
  played_at: string;
  plays: Array<{
    play_id: string;
    score: number;
    team_name: string | null;
    team_score: number;
  }>;
  quiz_id: string;
  session_id: string;
};
