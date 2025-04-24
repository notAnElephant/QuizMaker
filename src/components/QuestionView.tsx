import {useNavigate, useParams} from 'react-router-dom';
import {useQuiz} from '../context/QuizContext';
import {FaArrowLeft} from 'react-icons/fa';

export default function QuestionView() {
    const {catIndex, qIndex} = useParams();
    const {categories} = useQuiz();
    const navigate = useNavigate();

    const question = categories[+catIndex! - 1].questions[+qIndex! - 1];

    console.log(question);

    return (
        <div className="min-h-screen flex flex-col justify-between items-center text-black p-8">
            <div className="flex-1 flex items-center justify-center w-full">
                <div className="max-w-3xl w-full bg-yellow-100 bg-opacity-90 p-8 rounded-xl shadow text-center">
                    <h1 className="text-3xl font-bold mb-6 font-display">
                        {categories[+catIndex! - 1].category} {+qIndex!}.
                    </h1>

                    {question.type === 'text' && (
                        <>
                            <p className="text-2xl font-medium mb-6 font-display">{question.content}</p>
                            {question.list && (
                                <ul className="list-disc text-left mx-auto w-fit text-lg">
                                    {question.list.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}

                    {question.type === 'image' && (
                        <>
                            {question.content && (
                                <p className="text-2xl font-medium mb-6 font-display">{question.content}</p>
                            )}
                            <img
                                src={question.source}
                                alt="Kérdés képe"
                                className="mx-auto max-h-[60vh] rounded-lg"
                            />
                        </>
                    )}

                    {question.type === 'video' && (
                        <video src={question.content} controls className="mx-auto max-h-[60vh] rounded-lg" />
                    )}

                    {question.type === 'audio' && (
                        <audio src={question.content} controls className="mx-auto mt-4" />
                    )}
                </div>

            </div>
            <button
                onClick={() => navigate(-1)}
                className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
                aria-label="Back"
            >
                <FaArrowLeft size={20} />
            </button>
        </div>
    );
}

