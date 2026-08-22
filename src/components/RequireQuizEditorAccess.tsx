import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";

export default function RequireQuizEditorAccess({
  children,
}: {
  children: ReactNode;
}) {
  const { currentQuizAccessRole } = useQuiz();

  if (currentQuizAccessRole !== "VIEWER") {
    return children;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7efd9] p-6 text-[#24211c]">
      <section className="w-full max-w-md rounded-2xl border-2 border-[#24211c] bg-[#fff8e7] p-8 text-center shadow-[0_6px_0_#24211c]">
        <h1 className="font-display text-3xl font-bold">Csak megtekinthető</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#756b5c]">
          A tulajdonos megtekintési hozzáférést adott ehhez a kvízhez, ezért nem
          szerkeszthető.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-[#24211c] px-5 py-3 font-bold text-[#fff8e7] hover:bg-[#3a352d]"
        >
          Kvíz megnyitása
        </Link>
      </section>
    </main>
  );
}
