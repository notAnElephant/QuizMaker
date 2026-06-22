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

type QuestionUpdate = {
  content?: string;
  list?: string[];
  points?: number;
  source?: string;
  type?: "text" | "image" | "video" | "audio";
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
  addQuestionToCategory: (catIndex: number) => void;
  categories: Category[];
  createQuiz: (
    title: string,
    categoryNames: string[],
    questionsPerCategory: number,
  ) => void;
  currentQuizTitle: string;
  renameQuiz: (title: string) => void;
  loadQuiz: (title: string, nextCategories: Category[]) => void;
  markUsed: (catIndex: number, qIndex: number, value: boolean) => void;
  moveQuestion: (
    sourceCatIndex: number,
    sourceQuestionIndex: number,
    targetCatIndex: number,
    targetQuestionIndex: number,
  ) => void;
  updateQuestion: (
    catIndex: number,
    qIndex: number,
    updates: QuestionUpdate,
  ) => void;
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

  const updateQuestion = (
    catIndex: number,
    qIndex: number,
    updates: QuestionUpdate,
  ) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, currentCatIndex) => {
        if (currentCatIndex !== catIndex) {
          return category;
        }

        return {
          ...category,
          questions: category.questions.map((question, currentQuestionIndex) => {
            if (currentQuestionIndex !== qIndex) {
              return question;
            }

            return new Question(
              updates.type ?? question.type,
              updates.content ?? question.content,
              updates.source ?? question.source,
              updates.points ?? question.points,
              question.isUsed,
              updates.list ?? question.list,
            );
          }),
        };
      }),
    );
  };

  const updateQuestionPoints = (
    catIndex: number,
    qIndex: number,
    nextPoints: number,
  ) => {
    updateQuestion(catIndex, qIndex, { points: nextPoints });
  };

  const loadQuiz = (title: string, nextCategories: Category[]) => {
    setCurrentQuizTitle(title);
    setCategories(nextCategories);
  };

  const renameQuiz = (title: string) => {
    setCurrentQuizTitle(title);
  };

  const moveQuestion = (
    sourceCatIndex: number,
    sourceQuestionIndex: number,
    targetCatIndex: number,
    targetQuestionIndex: number,
  ) => {
    setCategories((prevCategories) => {
      if (
        !prevCategories[sourceCatIndex]?.questions[sourceQuestionIndex] ||
        !prevCategories[targetCatIndex]
      ) {
        return prevCategories;
      }

      if (
        sourceCatIndex === targetCatIndex &&
        (targetQuestionIndex === sourceQuestionIndex ||
          targetQuestionIndex === sourceQuestionIndex + 1)
      ) {
        return prevCategories;
      }

      const nextCategories = prevCategories.map((category) => ({
        ...category,
        questions: [...category.questions],
      }));

      const [movedQuestion] = nextCategories[sourceCatIndex].questions.splice(
        sourceQuestionIndex,
        1,
      );

      const safeTargetIndex = Math.max(
        0,
        Math.min(
          targetQuestionIndex,
          nextCategories[targetCatIndex].questions.length,
        ),
      );
      const adjustedTargetIndex =
        sourceCatIndex === targetCatIndex &&
        safeTargetIndex > sourceQuestionIndex
          ? safeTargetIndex - 1
          : safeTargetIndex;

      nextCategories[targetCatIndex].questions.splice(
        adjustedTargetIndex,
        0,
        movedQuestion,
      );

      return nextCategories;
    });
  };

  const addQuestionToCategory = (catIndex: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, currentCatIndex) => {
        if (currentCatIndex !== catIndex) {
          return category;
        }

        const lastQuestion = category.questions[category.questions.length - 1];
        const nextPoints = lastQuestion
          ? Math.max(1000, lastQuestion.points + 1000)
          : 1000;

        return {
          ...category,
          questions: [
            ...category.questions,
            new Question(
              "text",
              `Új kérdés ${category.questions.length + 1}`,
              undefined,
              nextPoints,
            ),
          ],
        };
      }),
    );
  };

  const createQuiz = (
    title: string,
    categoryNames: string[],
    questionsPerCategory: number,
  ) => {
    const normalizedQuestionCount = Math.max(1, questionsPerCategory);
    const nextCategories: Category[] = categoryNames.map((categoryName) => ({
      category: categoryName,
      questions: Array.from({ length: normalizedQuestionCount }, (_, index) => {
        const points = (index + 1) * 1000;

        return new Question("text", `Új kérdés ${index + 1}`, undefined, points);
      }),
    }));

    setCurrentQuizTitle(title);
    setCategories(nextCategories);
  };

  return (
    <QuizContext.Provider
      value={{
        addQuestionToCategory,
        categories,
        createQuiz,
        currentQuizTitle,
        loadQuiz,
        markUsed,
        moveQuestion,
        renameQuiz,
        updateQuestion,
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
