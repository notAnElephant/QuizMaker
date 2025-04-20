import { useNavigate } from 'react-router-dom';
import { Question } from '../models/Question';
import {useQuiz} from "../context/QuizContext.tsx";

type Category = {
    category: string;
    questions: Question[];
};

type Props = {
    data: Category[];
    onSelect: (catIndex: number, qIndex: number, double: boolean) => void;
};

export function Board({ data, onSelect }: Props) {
    const navigate = useNavigate();
    const { settings } = useQuiz();
    const { classicMode } = settings;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-5 gap-4">
                {data.map((cat, colIndex) => {
                    const firstUnansweredIndex = cat.questions.findIndex(q => !q.isUsed);

                    return (
                        <div key={colIndex} className="flex flex-col items-center gap-2">
                            <h2 className="font-bold text-center">{cat.category}</h2>
                            {cat.questions.map((q, rowIndex) => {
                                const isDisabled =
                                    q.isUsed || (classicMode && rowIndex !== firstUnansweredIndex);

                                return (
                                    <button
                                        key={`${colIndex}-${rowIndex}`}
                                        onClick={() => {
                                            onSelect(colIndex, rowIndex, true);
                                            setTimeout(() => navigate(`/question/${colIndex}/${rowIndex}`), 0);
                                        }}
                                        onAuxClick={() => onSelect(colIndex, rowIndex, false)}
                                        disabled={isDisabled}
                                        className={`p-4 rounded text-white w-28 ${
                                            q.isUsed
                                                ? 'bg-green-500'
                                                : isDisabled
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {rowIndex + 1}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
