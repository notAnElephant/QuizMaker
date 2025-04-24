import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import {FaArrowLeft} from "react-icons/fa";

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
                        onChange={(e) => setSettings(s => ({ ...s, classicMode: e.target.checked }))}
                    />
                    <span className="font-medium">Klasszikus mód</span>
                </label>
                <p className="text-sm text-gray-600 mt-1">
                    Ebben a módban minden kategóriából csak a következő kérdés választható ki,
                    illetve a már kiválasztott kérdések sem kattinthatóak.
                </p>
            </div>

            {/* Időzítő */}
            <div className="mb-8 text-left w-full max-w-md">
                <label className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        checked={settings.timerEnabled}
                        onChange={(e) => setSettings(s => ({ ...s, timerEnabled: e.target.checked }))}
                    />
                <span>Időzítő engedélyezve - <i>ez a funkció sajnos még nem elérhető :/</i></span>
                </label>
                <label className="font-medium block mb-2">
                    Időzítő (másodpercben)
                </label>
                <input
                    type="range"
                    min={1}
                    max={60}
                    disabled={!settings.timerEnabled}
                    value={settings.timerDuration}
                    onChange={(e) => setSettings(s => ({ ...s, timerDuration: Number(e.target.value) }))}
                />
                <div className="text-center mt-2 text-sm text-gray-600">
                    A kérdés megnyitásakor indul el – jelenleg: <strong>{settings.timerDuration} mp</strong>
                </div>
            </div>

            <button
                onClick={() => navigate('/')}
                className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
                aria-label="Back"
            >
                <FaArrowLeft size={20} />
            </button>
        </div>
    );
}
