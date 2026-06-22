import { createContext, useContext, useState, ReactNode } from "react";
import rawData from "../data/questions.json";
import { Question } from "../models/Question";
import { Category, Settings, Team } from "./types";

type RawQuestion = {
  content: string;
  isUsed?: boolean;
  list?: string[];
  points?: number;
  source?: string;
  type: "text" | "image" | "video" | "audio";
};

type RawCategory = {
  category: string;
  questions: RawQuestion[];
};

const initialData: Category[] = (rawData as RawCategory[]).map((cat) => ({
  category: cat.category,
  questions: cat.questions.map(
    (q) =>
      new Question(q.type, q.content, q.source, q.points, q.isUsed, q.list),
  ),
}));

const defaultSettings: Settings = {
  classicMode: false,
  timerEnabled: false,
  timerDuration: 30,
};

const QuizContext = createContext<{
  categories: Category[];
  currentQuizTitle: string;
  loadQuiz: (title: string, nextCategories: Category[]) => void;
  markUsed: (catIndex: number, qIndex: number, value: boolean) => void;
  updateQuestionPoints: (
    catIndex: number,
    qIndex: number,
    nextPoints: number,
  ) => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
} | null>(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuiz must be used within QuizProvider");
  return context;
};

export function QuizProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(initialData);
  const [currentQuizTitle, setCurrentQuizTitle] = useState("Vágó Pesta");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [teams, setTeams] = useState<Team[]>([
    {
      name: "Team 1",
      members: ["Member 1", "Member 2"],
      color: "#3498db",
      points: 0,
    },
    {
      name: "Team 2",
      members: ["Member 3", "Member 4"],
      color: "#e74c3c",
      points: 0,
    },
  ]);

  const markUsed = (catIndex: number, qIndex: number, value: boolean) => {
    const copy = [...categories];
    copy[catIndex].questions[qIndex].isUsed = value;
    setCategories(copy);
  };

  const updateQuestionPoints = (
    catIndex: number,
    qIndex: number,
    nextPoints: number,
  ) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, currentCatIndex) => {
        if (currentCatIndex !== catIndex) {
          return category;
        }

        return {
          ...category,
          questions: category.questions.map((question, currentQuestionIndex) =>
            currentQuestionIndex === qIndex
              ? new Question(
                  question.type,
                  question.content,
                  question.source,
                  nextPoints,
                  question.isUsed,
                  question.list,
                )
              : question,
          ),
        };
      }),
    );
  };

  const loadQuiz = (title: string, nextCategories: Category[]) => {
    setCurrentQuizTitle(title);
    setCategories(nextCategories);
  };

  return (
    <QuizContext.Provider
      value={{
        categories,
        currentQuizTitle,
        loadQuiz,
        markUsed,
        updateQuestionPoints,
        settings,
        setSettings,
        teams,
        setTeams,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
