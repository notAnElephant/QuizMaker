import { useMemo } from "react";
import { useQuiz } from "../context/QuizContext";
import { Question } from "../models/Question";
import { Board } from "./Board";
import PreviewBar from "./PreviewBar";

export default function QuizPreview() {
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
              question.revealAnswer,
              question.answerMediaType,
              question.answerSource,
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
      <PreviewBar />
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
