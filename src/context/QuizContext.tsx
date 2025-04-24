import { createContext, useContext, useState, ReactNode } from 'react';
import rawData from '../data/questions.json';
import { Question } from '../models/Question';

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
    questions: cat.questions.map((q: any) => new Question(q.type, q.content, q.source, q.isUsed, q.list))
}));

const defaultSettings: Settings = {
    classicMode: false,
    timerEnabled: false,
    timerDuration: 30
};

const QuizContext = createContext<{
    categories: Category[];
    markUsed: (catIndex: number, qIndex: number, value: boolean) => void;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
} | null>(null);

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) throw new Error('useQuiz must be used within QuizProvider');
    return context;
};

export function QuizProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState(initialData);
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    const markUsed = (catIndex: number, qIndex: number, value: boolean) => {
        const copy = [...categories];
        copy[catIndex].questions[qIndex].isUsed = value;
        setCategories(copy);
    };

    return (
        <QuizContext.Provider value={{ categories, markUsed, settings, setSettings }}>
            {children}
        </QuizContext.Provider>
    );
}
