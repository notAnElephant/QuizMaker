import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import rawData from "../data/questions.json";
import { Question, QuestionType } from "../models/Question";
import {
  defaultQuizAppearance,
  getQuizBackground,
} from "../utility/quizAppearance";
import { Category, QuizAppearance, Settings, Team } from "./types";

type RawQuestion = {
  content: string;
  correctAnswer?: string;
  isUsed?: boolean;
  list?: string[];
  points?: number;
  source?: string;
  type: QuestionType;
};

type RawCategory = { category: string; questions: RawQuestion[] };

type QuestionUpdate = {
  content?: string;
  correctAnswer?: string;
  list?: string[];
  points?: number;
  source?: string;
  type?: QuestionType;
};

const initialData: Category[] = (rawData as RawCategory[]).map((category) => ({
  category: category.category,
  questions: category.questions.map(
    (question) =>
      new Question(
        question.type,
        question.content,
        question.source,
        question.points,
        question.isUsed,
        question.list,
        question.correctAnswer,
      ),
  ),
}));

const defaultSettings: Settings = {
  classicMode: false,
  timerEnabled: false,
  timerDuration: 30,
};
const SETTINGS_STORAGE_KEY = "quizmaker.settings";

type QuizContextValue = {
  addCategory: () => void;
  addQuestionToCategory: (catIndex: number) => void;
  appearance: QuizAppearance;
  categories: Category[];
  createQuiz: (
    title: string,
    categoryNames: string[],
    questionsPerCategory: number,
  ) => void;
  currentQuizDescription: string;
  currentQuizId: string | null;
  currentQuizTitle: string;
  describeQuiz: (description: string) => void;
  loadQuiz: (
    quizId: string,
    title: string,
    description: string,
    nextCategories: Category[],
    nextAppearance?: QuizAppearance,
  ) => void;
  markPlayReadyToSave: () => void;
  markUsed: (catIndex: number, qIndex: number, value: boolean) => void;
  moveQuestion: (
    sourceCatIndex: number,
    sourceQuestionIndex: number,
    targetCatIndex: number,
    targetQuestionIndex: number,
  ) => void;
  playReadyToSave: boolean;
  playSaveStatus: "idle" | "saving" | "saved" | "error";
  playSessionId: string;
  removeCategory: (catIndex: number) => void;
  removeQuestion: (catIndex: number, qIndex: number) => void;
  renameCategory: (catIndex: number, name: string) => void;
  renameQuiz: (title: string) => void;
  setAppearance: React.Dispatch<React.SetStateAction<QuizAppearance>>;
  setCurrentQuizId: (quizId: string | null) => void;
  setPlaySaveStatus: React.Dispatch<
    React.SetStateAction<"idle" | "saving" | "saved" | "error">
  >;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  settings: Settings;
  teams: Team[];
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
};

const QuizContext = createContext<QuizContextValue | null>(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuiz must be used within QuizProvider");
  return context;
};

export function QuizProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<QuizAppearance>(
    defaultQuizAppearance,
  );
  const [categories, setCategories] = useState(initialData);
  const [currentQuizDescription, setCurrentQuizDescription] = useState(
    "Imported sample board quiz",
  );
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(
    "47559e6f-f126-4124-84d7-9d71d9467f6d",
  );
  const [currentQuizTitle, setCurrentQuizTitle] = useState("Vágó Pesta");
  const [playSessionId, setPlaySessionId] = useState(() => crypto.randomUUID());
  const [playReadyToSave, setPlayReadyToSave] = useState(false);
  const [playSaveStatus, setPlaySaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") return defaultSettings;

    try {
      const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      return storedSettings
        ? { ...defaultSettings, ...JSON.parse(storedSettings) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
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

  const markPlayReadyToSave = useCallback(() => setPlayReadyToSave(true), []);

  const markUsed = (catIndex: number, qIndex: number, value: boolean) => {
    setCategories((previousCategories) =>
      previousCategories.map((category, currentCatIndex) => {
        if (currentCatIndex !== catIndex) return category;
        return {
          ...category,
          questions: category.questions.map((question, currentQuestionIndex) =>
            currentQuestionIndex === qIndex
              ? new Question(
                  question.type,
                  question.content,
                  question.source,
                  question.points,
                  value,
                  question.list,
                  question.correctAnswer,
                )
              : question,
          ),
        };
      }),
    );
  };

  const updateQuestion = (
    catIndex: number,
    qIndex: number,
    updates: QuestionUpdate,
  ) => {
    setCategories((previousCategories) =>
      previousCategories.map((category, currentCatIndex) => {
        if (currentCatIndex !== catIndex) return category;
        return {
          ...category,
          questions: category.questions.map((question, currentQuestionIndex) =>
            currentQuestionIndex === qIndex
              ? new Question(
                  updates.type ?? question.type,
                  updates.content ?? question.content,
                  updates.source ?? question.source,
                  updates.points ?? question.points,
                  question.isUsed,
                  updates.list ?? question.list,
                  updates.correctAnswer ?? question.correctAnswer,
                )
              : question,
          ),
        };
      }),
    );
  };

  const updateQuestionPoints = (
    catIndex: number,
    qIndex: number,
    nextPoints: number,
  ) => updateQuestion(catIndex, qIndex, { points: nextPoints });

  const loadQuiz = (
    quizId: string,
    title: string,
    description: string,
    nextCategories: Category[],
    nextAppearance: QuizAppearance = defaultQuizAppearance,
  ) => {
    setCurrentQuizId(quizId);
    setCurrentQuizTitle(title);
    setCurrentQuizDescription(description);
    setCategories(nextCategories);
    setAppearance(nextAppearance);
    setPlaySessionId(crypto.randomUUID());
    setPlayReadyToSave(false);
    setPlaySaveStatus("idle");
  };

  const addCategory = () => {
    setCategories((currentCategories) => [
      ...currentCategories,
      {
        category: `Új kategória ${currentCategories.length + 1}`,
        questions: [new Question("text", "Új kérdés", undefined, 1000)],
      },
    ]);
  };

  const renameCategory = (catIndex: number, name: string) => {
    setCategories((currentCategories) =>
      currentCategories.map((category, index) =>
        index === catIndex ? { ...category, category: name } : category,
      ),
    );
  };

  const removeCategory = (catIndex: number) => {
    setCategories((currentCategories) =>
      currentCategories.filter((_, index) => index !== catIndex),
    );
  };

  const removeQuestion = (catIndex: number, qIndex: number) => {
    setCategories((currentCategories) =>
      currentCategories.map((category, index) =>
        index === catIndex
          ? {
              ...category,
              questions: category.questions.filter(
                (_, questionIndex) => questionIndex !== qIndex,
              ),
            }
          : category,
      ),
    );
  };

  const moveQuestion = (
    sourceCatIndex: number,
    sourceQuestionIndex: number,
    targetCatIndex: number,
    targetQuestionIndex: number,
  ) => {
    setCategories((previousCategories) => {
      if (
        !previousCategories[sourceCatIndex]?.questions[sourceQuestionIndex] ||
        !previousCategories[targetCatIndex]
      )
        return previousCategories;
      if (
        sourceCatIndex === targetCatIndex &&
        (targetQuestionIndex === sourceQuestionIndex ||
          targetQuestionIndex === sourceQuestionIndex + 1)
      )
        return previousCategories;

      const nextCategories = previousCategories.map((category) => ({
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
    setCategories((previousCategories) =>
      previousCategories.map((category, currentCatIndex) => {
        if (currentCatIndex !== catIndex) return category;
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
    const questionCount = Math.max(1, questionsPerCategory);
    const nextCategories = categoryNames.map((category) => ({
      category,
      questions: Array.from(
        { length: questionCount },
        (_, index) =>
          new Question(
            "text",
            `Új kérdés ${index + 1}`,
            undefined,
            (index + 1) * 1000,
          ),
      ),
    }));
    setCurrentQuizId(null);
    setCurrentQuizTitle(title);
    setCurrentQuizDescription("");
    setCategories(nextCategories);
    setAppearance(defaultQuizAppearance);
    setPlaySessionId(crypto.randomUUID());
    setPlayReadyToSave(false);
    setPlaySaveStatus("idle");
  };

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    document.body.style.backgroundImage = getQuizBackground(appearance);
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = appearance.textColor;
  }, [appearance]);

  return (
    <QuizContext.Provider
      value={{
        addCategory,
        addQuestionToCategory,
        appearance,
        categories,
        createQuiz,
        currentQuizDescription,
        currentQuizId,
        currentQuizTitle,
        describeQuiz: setCurrentQuizDescription,
        loadQuiz,
        markPlayReadyToSave,
        markUsed,
        moveQuestion,
        playReadyToSave,
        playSaveStatus,
        playSessionId,
        removeCategory,
        removeQuestion,
        renameCategory,
        renameQuiz: setCurrentQuizTitle,
        setAppearance,
        setCurrentQuizId,
        setPlaySaveStatus,
        setSettings,
        setTeams,
        settings,
        teams,
        updateQuestion,
        updateQuestionPoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
