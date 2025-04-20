import {useNavigate, useParams} from 'react-router-dom';
import {useQuiz} from '../context/QuizContext';

export default function QuestionView() {
    const {catIndex, qIndex} = useParams();
    const {categories} = useQuiz();
    const navigate = useNavigate();

    const question = categories[+catIndex!].questions[+qIndex!];

    return (
        <div className="min-h-screen flex flex-col justify-between items-center text-black p-8">
            <div className="flex-1 flex items-center justify-center w-full">
                <div className="max-w-3xl w-full bg-yellow-100 bg-opacity-90 p-8 rounded-xl shadow text-center">
                    <h1 className="text-3xl font-bold mb-6">
                        {categories[+catIndex!].category} {+qIndex! + 1}.
                    </h1>

                    {question.type === 'text' && (
                        <>
                            <p className="text-2xl font-medium mb-6">{question.content}</p>
                            {question.list && (
                                <ul className="list-disc text-left mx-auto w-fit text-lg">
                                    {question.list.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </div>

            <button
                onClick={() => navigate(-1)}
                className="mt-8 px-6 py-3 bg-gray-800 text-white rounded text-lg"
            >
                Vissza
            </button>
        </div>
    );
}

