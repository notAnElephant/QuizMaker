import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaClock, FaEye, FaUndo } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { QuestionType } from "../models/Question";
import PreviewBar from "./PreviewBar";
import TeamBar from "./TeamBar";

function QuestionMedia({
  alt,
  source,
  type,
}: {
  alt: string;
  source?: string;
  type: QuestionType;
}) {
  if (!source || type === "text") return null;

  if (type === "image") {
    return (
      <img
        src={source}
        alt={alt}
        className="mx-auto max-h-[46vh] rounded-xl border border-[#24211c]/30 object-contain"
      />
    );
  }
  if (type === "video") {
    return (
      <video
        src={source}
        controls
        className="mx-auto max-h-[46vh] max-w-full rounded-xl"
      />
    );
  }
  return <audio src={source} controls className="mx-auto mt-4 max-w-full" />;
}

function QuestionTimer({
  duration,
  remaining,
  stopped,
}: {
  duration: number;
  remaining: number;
  stopped: boolean;
}) {
  const expired = remaining === 0;
  const warning = !expired && remaining <= Math.min(10, duration * 0.25);
  const progress = (remaining / duration) * 100;
  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <div
      role="timer"
      aria-label={expired ? "Lejárt az idő" : `${remaining} másodperc van hátra`}
      className={`min-w-32 rounded-xl border-2 px-3 py-2 font-sans shadow-[0_3px_0_currentColor] ${
        expired
          ? "border-[#9d2d24] bg-[#ffd8d2] text-[#7b2019]"
          : warning
            ? "border-[#b65318] bg-[#ffe2ad] text-[#71320f]"
            : "border-[#24211c] bg-white/65 text-[#24211c]"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <FaClock aria-hidden="true" />
        <span className="text-lg font-black tabular-nums">
          {minutes}:{seconds}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Hátralévő idő"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={remaining}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/15"
      >
        <div
          className="h-full rounded-full bg-current transition-[width] duration-200 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
      {expired || stopped ? (
        <p className="mt-1 text-xs font-black uppercase tracking-wide">
          {expired ? "Lejárt az idő" : "Megállítva"}
        </p>
      ) : null}
    </div>
  );
}

export default function QuestionView({
  preview = false,
}: {
  preview?: boolean;
}) {
  const { catIndex, qIndex } = useParams();
  const { appearance, categories, markPlayReadyToSave, settings } = useQuiz();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);
  const timerDuration = Math.min(
    60,
    Math.max(1, Math.round(settings.timerDuration || 30)),
  );
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [timerStopped, setTimerStopped] = useState(false);
  const timerDeadline = useRef(Date.now() + timerDuration * 1000);
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

  useEffect(() => {
    setShowAnswer(false);
    setTimerStopped(false);
    setTimeRemaining(timerDuration);
    timerDeadline.current = Date.now() + timerDuration * 1000;
  }, [catIndex, qIndex, settings.timerEnabled, timerDuration]);

  useEffect(() => {
    if (!settings.timerEnabled || timerStopped) return;

    const updateTimer = () => {
      const nextRemaining = Math.max(
        0,
        Math.ceil((timerDeadline.current - Date.now()) / 1000),
      );
      setTimeRemaining((current) =>
        current === nextRemaining ? current : nextRemaining,
      );
      if (nextRemaining === 0) window.clearInterval(intervalId);
    };
    const intervalId = window.setInterval(updateTimer, 250);
    updateTimer();

    return () => window.clearInterval(intervalId);
  }, [catIndex, qIndex, settings.timerEnabled, timerDuration, timerStopped]);

  if (!category || !question) {
    return (
      <main className="grid min-h-screen place-items-center p-8">
        {preview ? <PreviewBar fixed /> : null}
        <button
          onClick={() => navigate(preview ? "/preview" : "/")}
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
      {preview ? <PreviewBar fixed /> : null}

      <div className="flex w-full flex-1 items-center justify-center py-12">
        <div className="quiz-card w-full max-w-3xl">
          <div className={`quiz-card-inner ${showAnswer ? "is-flipped" : ""}`}>
            <section
              className="quiz-card-face flex flex-col rounded-2xl border-2 border-[#24211c] bg-[#fff4d6]/95 p-6 text-center text-[#24211c] shadow-[0_6px_0_#24211c] sm:p-10"
              aria-hidden={showAnswer}
            >
              <div className="mb-6 flex flex-wrap items-center justify-center gap-4 sm:justify-between">
                <h1 className="font-display text-3xl font-bold">
                  {category.category} · {question.points}
                </h1>
                {settings.timerEnabled ? (
                  <QuestionTimer
                    duration={timerDuration}
                    remaining={timeRemaining}
                    stopped={timerStopped}
                  />
                ) : null}
              </div>

              <p className="mb-6 font-display text-2xl font-medium">
                {question.content}
              </p>

              <QuestionMedia
                type={question.type}
                source={
                  question.source ??
                  (question.type === "video" || question.type === "audio"
                    ? question.content
                    : undefined)
                }
                alt="Kérdés médiája"
              />

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

              {question.correctAnswer || question.answerSource ? (
                <div className="mt-auto pt-7">
                  <button
                    onClick={() => {
                      setTimerStopped(true);
                      setShowAnswer(true);
                    }}
                    tabIndex={showAnswer ? -1 : 0}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-[#24211c] bg-[#ffd75a] px-5 py-3 font-bold shadow-[0_3px_0_#24211c] transition hover:-translate-y-0.5 hover:shadow-[0_5px_0_#24211c] motion-reduce:transition-none"
                  >
                    <FaEye aria-hidden="true" />
                    Válasz felfedése
                  </button>
                </div>
              ) : null}
            </section>

            <section
              className="quiz-card-face quiz-card-answer flex flex-col rounded-2xl border-2 border-[#356b3f] bg-[#dff2d9] p-6 text-center text-[#183a20] shadow-[0_6px_0_#183a20] sm:p-10"
              aria-hidden={!showAnswer}
            >
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#356b3f]">
                Helyes válasz
              </p>
              {question.correctAnswer ? (
                <h2 className="mb-6 mt-3 whitespace-pre-wrap font-display text-3xl font-bold sm:text-4xl">
                  {question.correctAnswer}
                </h2>
              ) : null}
              <QuestionMedia
                type={question.answerMediaType ?? "image"}
                source={question.answerSource}
                alt="Válasz médiája"
              />
              <div className="mt-auto pt-7">
                <button
                  onClick={() => setShowAnswer(false)}
                  tabIndex={showAnswer ? 0 : -1}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-[#183a20] bg-white/60 px-5 py-3 font-bold shadow-[0_3px_0_#183a20] transition hover:-translate-y-0.5 hover:shadow-[0_5px_0_#183a20] motion-reduce:transition-none"
                >
                  <FaUndo aria-hidden="true" />
                  Kérdés visszafordítása
                </button>
              </div>
            </section>
          </div>
        </div>
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
