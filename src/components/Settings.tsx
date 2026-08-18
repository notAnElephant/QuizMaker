import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";

export default function Settings() {
  const navigate = useNavigate();
  const { settings, setSettings } = useQuiz();

  return (
    <main className="min-h-screen bg-[#f7efd9] p-6 text-[#24211c] sm:p-10">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/editor")}
          className="mb-8 inline-flex items-center gap-2 font-bold"
        >
          <FaArrowLeft /> Szerkesztő
        </button>
        <h1 className="font-display text-4xl">Játékbeállítások</h1>

        <section className="mt-8 border-y border-[#cfc2aa] py-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={settings.classicMode}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  classicMode: event.target.checked,
                }))
              }
              className="mt-1 size-4 accent-[#d48313]"
            />
            <span>
              <strong className="block">Klasszikus mód</strong>
              <span className="mt-1 block text-sm text-[#756b5c]">
                Kategóriánként mindig csak a következő kérdés választható.
              </span>
            </span>
          </label>
        </section>

        <section className="py-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={settings.timerEnabled}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  timerEnabled: event.target.checked,
                }))
              }
              className="mt-1 size-4 accent-[#d48313]"
            />
            <span>
              <strong className="block">Időzítő</strong>
              <span className="mt-1 block text-sm text-[#756b5c]">
                Ez a funkció még nincs bekötve a játékmódba.
              </span>
            </span>
          </label>
          <label className="mt-5 block text-sm font-bold">
            Időtartam: {settings.timerDuration} másodperc
            <input
              type="range"
              min={1}
              max={60}
              disabled={!settings.timerEnabled}
              value={settings.timerDuration}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  timerDuration: Number(event.target.value),
                }))
              }
              className="mt-3 block w-full accent-[#d48313] disabled:opacity-40"
            />
          </label>
        </section>
      </div>
    </main>
  );
}
