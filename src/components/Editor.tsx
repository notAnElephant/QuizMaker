import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";

export default function Editor() {
  const navigate = useNavigate();
  const { categories, currentQuizTitle, updateQuestionPoints } = useQuiz();

  return (
    <div className="min-h-screen p-8 text-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display text-white">Pontszám editor</h1>
            <p className="mt-2 text-sm text-white/85">
              Aktuális kvíz: <strong>{currentQuizTitle}</strong>
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-gray-800 p-3 text-white shadow-lg hover:bg-gray-700"
            aria-label="Back"
          >
            <FaArrowLeft size={18} />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((category, catIndex) => (
            <section
              key={category.category}
              className="rounded-2xl bg-white/92 p-5 shadow"
            >
              <h2 className="text-2xl font-bold">{category.category}</h2>
              <div className="mt-4 flex flex-col gap-3">
                {category.questions.map((question, qIndex) => (
                  <div
                    key={`${category.category}-${qIndex}`}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{question.content}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          Típus: {question.type}
                        </p>
                      </div>

                      <label className="flex min-w-32 flex-col gap-1 text-sm font-medium">
                        Pontszám
                        <input
                          type="number"
                          min={0}
                          step={100}
                          value={question.points}
                          onChange={(event) => {
                            const parsedValue = Number(event.target.value);
                            if (!Number.isFinite(parsedValue)) {
                              return;
                            }

                            updateQuestionPoints(catIndex, qIndex, parsedValue);
                          }}
                          className="rounded-lg border border-gray-300 px-3 py-2"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="rounded-2xl bg-white/90 p-4 text-sm text-gray-700 shadow">
          A pontszám módosításai azonnal érvényesülnek a táblán is. Ha meg akarod
          őrizni őket, utána mentsd el újra a kvízt.
        </div>
      </div>
    </div>
  );
}
