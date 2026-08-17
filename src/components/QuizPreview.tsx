import { useMemo } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { Question } from "../models/Question";
import { Board } from "./Board";

export default function QuizPreview() {
  const navigate = useNavigate();
  const { appearance, categories, currentQuizTitle } = useQuiz();
  const previewCategories = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        questions: category.questions.map(
          (question) =>
            new Question(
              question.type,
              question.content,
              question.source,
              question.points,
              false,
              question.list,
              question.correctAnswer,
            ),
        ),
      })),
    [categories],
  );

  return (
    <main
      className="flex min-h-screen flex-col items-center"
      style={{ color: appearance.textColor }}
    >
      <header className="flex w-full items-center justify-between gap-4 border-b-2 border-[#24211c] bg-[#fff4d6]/95 px-4 py-3 text-[#24211c] sm:px-6">
        <button
          onClick={() => navigate("/editor")}
          className="inline-flex items-center gap-2 font-bold"
        >
          <FaArrowLeft aria-hidden="true" />
          Szerkesztő
        </button>
        <strong>Előnézet · a játékállás nem változik</strong>
      </header>
      <div className="flex w-full max-w-5xl flex-1 flex-col items-center px-2 pb-8 text-center sm:px-4">
        <h1 className="readable-on-image mb-7 mt-12 font-display text-4xl font-bold sm:mt-16 sm:text-6xl">
          {currentQuizTitle}
        </h1>
        <Board
          data={previewCategories}
          font="font-display readable-on-image"
          onSelect={() => undefined}
          questionPathPrefix="/preview/question"
        />
      </div>
    </main>
  );
}
