import { useEffect, useState } from "react";
import { FaArrowLeft, FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import TeamBar from "./TeamBar";

export default function QuestionView({
  preview = false,
}: {
  preview?: boolean;
}) {
  const { catIndex, qIndex } = useParams();
  const { appearance, categories, markPlayReadyToSave } = useQuiz();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);
  const category = categories[Number(catIndex) - 1];
  const question = category?.questions[Number(qIndex) - 1];
  const allQuestionsUsed = categories.every((currentCategory) =>
    currentCategory.questions.every(
      (currentQuestion) => currentQuestion.isUsed,
    ),
  );

  useEffect(() => {
    if (!preview && allQuestionsUsed) markPlayReadyToSave();
  }, [allQuestionsUsed, markPlayReadyToSave, preview]);

  if (!category || !question) {
    return (
      <main className="grid min-h-screen place-items-center p-8">
        <button
          onClick={() => navigate(preview ? "/editor" : "/")}
          className="rounded-lg border-2 border-[#24211c] bg-[#fff4d6] px-5 py-3 font-semibold text-[#24211c]"
        >
          Vissza
        </button>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-5 sm:p-8"
      style={{ color: appearance.textColor }}
    >
      {preview ? (
        <div className="fixed left-1/2 top-4 z-20 -translate-x-1/2 rounded-lg border-2 border-[#24211c] bg-[#fff4d6] px-4 py-2 text-sm font-bold text-[#24211c] shadow-[0_3px_0_#24211c]">
          Előnézet · a játékállás nem változik
        </div>
      ) : null}

      <div className="flex w-full flex-1 items-center justify-center pt-12">
        <section className="w-full max-w-3xl rounded-2xl border-2 border-[#24211c] bg-[#fff4d6]/95 p-6 text-center text-[#24211c] shadow-[0_6px_0_#24211c] sm:p-10">
          <h1 className="mb-6 font-display text-3xl font-bold">
            {category.category} · {question.points}
          </h1>

          <p className="mb-6 font-display text-2xl font-medium">
            {question.content}
          </p>

          {question.type === "image" && question.source ? (
            <img
              src={question.source}
              alt="Kérdés képe"
              className="mx-auto max-h-[52vh] rounded-xl border border-[#24211c]/30 object-contain"
            />
          ) : null}
          {question.type === "video" ? (
            <video
              src={question.source ?? question.content}
              controls
              className="mx-auto max-h-[52vh] rounded-xl"
            />
          ) : null}
          {question.type === "audio" ? (
            <audio
              src={question.source ?? question.content}
              controls
              className="mx-auto mt-4"
            />
          ) : null}

          {question.list?.length ? (
            <ul className="mx-auto mt-6 grid max-w-xl gap-2 text-left sm:grid-cols-2">
              {question.list.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-lg border border-[#24211c]/30 bg-white/55 px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          {question.correctAnswer ? (
            <div className="mt-7">
              {showAnswer ? (
                <div className="rounded-xl border-2 border-[#356b3f] bg-[#dff2d9] px-5 py-4 text-lg font-bold text-[#183a20]">
                  {question.correctAnswer}
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-[#24211c] bg-[#ffd75a] px-5 py-3 font-bold shadow-[0_3px_0_#24211c] transition hover:-translate-y-0.5 hover:shadow-[0_5px_0_#24211c]"
                >
                  <FaEye aria-hidden="true" />
                  Válasz felfedése
                </button>
              )}
            </div>
          ) : null}
        </section>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-4 left-4 grid size-12 place-items-center rounded-full border-2 border-[#24211c] bg-[#fff4d6] text-[#24211c] shadow-[0_3px_0_#24211c]"
        aria-label="Vissza"
      >
        <FaArrowLeft size={18} />
      </button>
      {preview ? null : (
        <TeamBar mode="question" questionPoints={question.points} />
      )}
    </main>
  );
}
