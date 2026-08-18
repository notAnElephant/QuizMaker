import { FormEvent, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuiz } from "../context/QuizContext";

const DEFAULT_CATEGORIES = ["Témakör 1", "Témakör 2", "Témakör 3", "Témakör 4"];

export default function NewQuiz() {
  const navigate = useNavigate();
  const { createQuiz } = useQuiz();

  const [title, setTitle] = useState("Új kvíz");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES.join(", "));
  const [questionsPerCategory, setQuestionsPerCategory] = useState(5);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedCategories = categories
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean);

    if (!title.trim() || !parsedCategories.length) {
      toast.error("Adj meg címet és legalább egy témakört.");
      return;
    }

    createQuiz(title.trim(), parsedCategories, questionsPerCategory);
    navigate("/");
  };

  return (
    <div className="min-h-screen p-8 text-black">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-display text-white">Új kvíz</h1>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-gray-800 p-3 text-white shadow-lg hover:bg-gray-700"
            aria-label="Back"
          >
            <FaArrowLeft size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white/92 p-6 shadow"
        >
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="font-semibold">Cím</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-semibold">Témakörök</span>
              <textarea
                value={categories}
                onChange={(event) => setCategories(event.target.value)}
                rows={4}
                className="rounded-lg border border-gray-300 px-3 py-2"
              />
              <span className="text-sm text-gray-600">
                Vesszővel elválasztva, például: Történelem, Földrajz, Zene
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-semibold">
                Kérdések száma kategóriánként
              </span>
              <input
                type="number"
                min={1}
                max={10}
                value={questionsPerCategory}
                onChange={(event) =>
                  setQuestionsPerCategory(Number(event.target.value))
                }
                className="w-32 rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-white hover:bg-emerald-600"
            >
              <FaPlus size={16} />
              Kvíz létrehozása
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
