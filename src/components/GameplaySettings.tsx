import { useQuiz } from "../context/QuizContext";

export default function GameplaySettings() {
  const { settings, setSettings } = useQuiz();

  return (
    <section aria-labelledby="gameplay-settings-heading">
      <h2 id="gameplay-settings-heading" className="text-xl font-black">
        Játékmenet
      </h2>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-[#cfc2aa] bg-[#fff8e7] p-3">
        <input
          type="checkbox"
          checked={settings.classicMode}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              classicMode: event.target.checked,
            }))
          }
          className="mt-0.5 size-4 accent-[#d48313]"
        />
        <span>
          <strong className="block text-sm">Klasszikus mód</strong>
          <span className="mt-1 block text-xs leading-relaxed text-[#756b5c]">
            Kategóriánként mindig csak a következő kérdés választható.
          </span>
        </span>
      </label>

      <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-[#cfc2aa] bg-[#fff8e7] p-3">
        <input
          type="checkbox"
          checked={settings.timerEnabled}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              timerEnabled: event.target.checked,
            }))
          }
          className="mt-0.5 size-4 accent-[#d48313]"
        />
        <span>
          <strong className="block text-sm">Időzítő</strong>
          <span className="mt-1 block text-xs leading-relaxed text-[#756b5c]">
            Az időzítő jelenleg még nincs bekötve a játékmódba.
          </span>
        </span>
      </label>

      <label className="mt-4 block text-sm font-bold">
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
          className="mt-2 block w-full accent-[#d48313] disabled:opacity-40"
        />
      </label>
    </section>
  );
}
