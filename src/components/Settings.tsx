import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";

const backgroundOptions = [
  {
    id: "default",
    label: "Alap",
    preview:
      'linear-gradient(135deg, rgba(12, 18, 31, 0.8), rgba(26, 54, 93, 0.6)), url("./assets/bg.png")',
  },
  {
    id: "sunset",
    label: "Naplemente",
    preview: "linear-gradient(135deg, #4a1942 0%, #893168 40%, #ff784f 100%)",
  },
  {
    id: "forest",
    label: "Erdő",
    preview: "linear-gradient(135deg, #0f3d2e 0%, #174f3b 35%, #2f6f4f 100%)",
  },
  {
    id: "ocean",
    label: "Óceán",
    preview: "linear-gradient(135deg, #0b2545 0%, #134074 40%, #3f88c5 100%)",
  },
] as const;

export default function Settings() {
  const navigate = useNavigate();
  const { settings, setSettings } = useQuiz();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-black p-8">
      <h1 className="text-3xl font-bold mb-10">Beállítások</h1>

      {/* Klasszikus mód */}
      <div className="mb-6 text-left w-full max-w-md">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.classicMode}
            onChange={(e) =>
              setSettings((s) => ({ ...s, classicMode: e.target.checked }))
            }
          />
          <span className="font-medium">Klasszikus mód</span>
        </label>
        <p className="text-sm text-gray-600 mt-1">
          Ebben a módban minden kategóriából csak a következő kérdés választható
          ki
        </p>
      </div>

      {/* Időzítő */}
      <div className="mb-8 text-left w-full max-w-md">
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={settings.timerEnabled}
            onChange={(e) =>
              setSettings((s) => ({ ...s, timerEnabled: e.target.checked }))
            }
          />
          <span>
            Időzítő engedélyezve -{" "}
            <i>ez a funkció sajnos még nem elérhető :/</i>
          </span>
        </label>
        <label className="font-medium block mb-2">Időzítő (másodpercben)</label>
        <input
          type="range"
          min={1}
          max={60}
          disabled={!settings.timerEnabled}
          value={settings.timerDuration}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              timerDuration: Number(e.target.value),
            }))
          }
        />
        <div className="text-center mt-2 text-sm text-gray-600">
          A kérdés megnyitásakor indul el – jelenleg:{" "}
          <strong>{settings.timerDuration} mp</strong>
        </div>
      </div>

      <div className="mb-8 text-left w-full max-w-3xl">
        <h2 className="mb-3 text-xl font-bold">Háttér</h2>
        <p className="mb-4 text-sm text-gray-600">
          Választhatsz előre beállított témát, vagy feltölthetsz saját képet a
          kvíz hátterének.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {backgroundOptions.map((option) => {
            const isSelected =
              settings.backgroundMode === "preset" &&
              settings.backgroundPreset === option.id;

            return (
              <button
                key={option.id}
                onClick={() =>
                  setSettings((currentSettings) => ({
                    ...currentSettings,
                    backgroundMode: "preset",
                    backgroundPreset: option.id,
                  }))
                }
                className={`overflow-hidden rounded-2xl border-2 text-left shadow transition ${
                  isSelected
                    ? "border-emerald-500 ring-2 ring-emerald-200"
                    : "border-white/60 hover:border-gray-300"
                }`}
              >
                <div
                  className="h-24 w-full"
                  style={{
                    backgroundImage: option.preview,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="bg-white px-4 py-3">
                  <div className="font-medium">{option.label}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-white/80 p-5 shadow">
          <label className="mb-3 block font-medium">Saját háttérkép</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }

              const reader = new FileReader();
              reader.onload = () => {
                const imageData =
                  typeof reader.result === "string" ? reader.result : undefined;

                if (!imageData) {
                  return;
                }

                setSettings((currentSettings) => ({
                  ...currentSettings,
                  backgroundImage: imageData,
                  backgroundMode: "image",
                }));
              };
              reader.readAsDataURL(file);
              event.target.value = "";
            }}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() =>
                setSettings((currentSettings) => ({
                  ...currentSettings,
                  backgroundMode: currentSettings.backgroundImage
                    ? "image"
                    : "preset",
                }))
              }
              disabled={!settings.backgroundImage}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              Saját kép használata
            </button>

            <button
              onClick={() =>
                setSettings((currentSettings) => ({
                  ...currentSettings,
                  backgroundImage: undefined,
                  backgroundMode: "preset",
                  backgroundPreset: "default",
                }))
              }
              className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
            >
              Visszaállítás
            </button>
          </div>

          {settings.backgroundImage ? (
            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Feltöltött kép előnézet
              </div>
              <img
                src={settings.backgroundImage}
                alt="Háttér előnézet"
                className="h-40 w-full rounded-xl object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
        aria-label="Back"
      >
        <FaArrowLeft size={20} />
      </button>
    </div>
  );
}
