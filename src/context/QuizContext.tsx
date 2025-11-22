import { createContext, useContext, useState, ReactNode } from "react";
import rawData from "../data/questions.json";
import { Question } from "../models/Question";

export type Team = {
  name: string;
  members: string[];
  color: string;
  points: number;
};

export type Category = {
  category: string;
  questions: Question[];
};

export type Settings = {
  classicMode: boolean;
  timerEnabled: boolean;
  timerDuration: number;
};

const initialData: Category[] = rawData.map((cat) => ({
  category: cat.category,
  questions: cat.questions.map(
    (q: any) =>
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
  markUsed: (catIndex: number, qIndex: number, value: boolean) => void;
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

  return (
    <QuizContext.Provider
      value={{ categories, markUsed, settings, setSettings, teams, setTeams }}
    >
      {children}
    </QuizContext.Provider>
  );
}
