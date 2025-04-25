import {useNavigate} from 'react-router-dom';
import {Question} from '../models/Question';
import {useQuiz} from "../context/QuizContext.tsx";
import { cn } from '../utility/utils.ts';

type Category = {
    category: string;
    questions: Question[];
};

type Props = {
    data: Category[];
    onSelect: (catIndex: number, qIndex: number, double: boolean) => void;
    font?: string;
};

export function Board({data, onSelect, font}: Props) {
    const navigate = useNavigate();
    const {settings} = useQuiz();
    const {classicMode} = settings;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="max-w-screen-xl w-full overflow-x-auto px-4">
                <div
                    className={`grid gap-4`}
                    style={{gridTemplateColumns: `repeat(${data.length}, minmax(100px, 1fr))`}}
                >
                    {data.map((cat, colIndex) => {
                        const firstUnansweredIndex = cat.questions.findIndex(q => !q.isUsed);

                        return (
                            <div key={colIndex} className="flex flex-col items-center gap-2">
                                <h2 className={cn("font-bold text-2xl text-center", font)}>{cat.category}</h2>
                                {cat.questions.map((q, rowIndex) => {
                                    const isDisabled =
                                        q.isUsed || (classicMode && rowIndex !== firstUnansweredIndex);

                                    return (
                                        <button
                                            key={`${colIndex}-${rowIndex}`}
                                            onClick={() => {
                                                onSelect(colIndex, rowIndex, true);
                                                setTimeout(() => navigate(`/question/${colIndex + 1}/${rowIndex + 1}`), 0);
                                            }}
                                            onAuxClick={() => onSelect(colIndex, rowIndex, false)}
                                            disabled={isDisabled}
                                            className={`p-4 rounded text-white w-full ${
                                                q.isUsed
                                                    ? 'bg-green-500'
                                                    : isDisabled
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                        >
                                            {q.points}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
