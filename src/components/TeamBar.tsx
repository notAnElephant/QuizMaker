import { useState } from "react";
import { useQuiz } from "../context/QuizContext";
import ConfettiExplosion from "react-confetti-explosion";
import { FaPen, FaUsers } from "react-icons/fa";

type TeamBarProps = {
  mode: "board" | "question";
  questionPoints?: number;
};

export default function TeamBar({ mode, questionPoints = 0 }: TeamBarProps) {
  const { teams, setTeams } = useQuiz();
  const [confetti, setConfetti] = useState<boolean[]>(
    Array(teams.length).fill(false),
  );
  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  const [scoreInput, setScoreInput] = useState("");

  if (teams.length === 0) return null;

  const updatePoints = (index: number, delta: number) => {
    if (delta > 0) {
      setConfetti((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
    }

    setTeams((prev) =>
      prev.map((team, i) =>
        i === index ? { ...team, points: (team.points || 0) + delta } : team,
      ),
    );
  };

  const hideConfetti = (index: number) => () => {
    setConfetti((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const openScoreEditor = (index: number) => {
    setEditingTeam(index);
    setScoreInput(String(teams[index].points || 0));
  };

  const saveScore = () => {
    if (editingTeam === null) return;

    const score = Number(scoreInput);
    if (!Number.isFinite(score)) return;

    setTeams((prev) =>
      prev.map((team, index) =>
        index === editingTeam ? { ...team, points: Math.trunc(score) } : team,
      ),
    );
    setEditingTeam(null);
  };

  return (
    <div
      className={`flex flex-wrap justify-center gap-4 ${
        mode === "question" ? "w-auto py-0" : "w-full px-14 py-4 sm:px-16"
      }`}
    >
      {teams.map((team, i) => (
        <div
          key={i}
          className="relative flex w-80 max-w-full items-center gap-3 rounded-xl px-4 py-2 shadow"
          style={{ backgroundColor: team.color, color: "#fff" }}
        >
          {confetti[i] && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <ConfettiExplosion duration={1500} onComplete={hideConfetti(i)} />
            </div>
          )}
          <div className="relative group flex items-center">
            <button>
              <FaUsers className="text-white opacity-80 hover:opacity-100" />
            </button>
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-max max-w-xs bg-black text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition">
              {team.members.length > 0
                ? team.members.join(", ")
                : "Nincs megadva csapattag."}
            </div>
          </div>
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate font-bold">{team.name}</span>
            <span className="shrink-0 whitespace-nowrap text-sm">
              ({team.points || 0} pont)
            </span>
          </div>

          {mode === "question" && (
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <button
                onClick={() => updatePoints(i, questionPoints)}
                className="rounded bg-white px-2 text-black font-bold"
                aria-label={`${team.name} pontjainak növelése`}
              >
                +
              </button>
              <button
                onClick={() => updatePoints(i, -questionPoints)}
                className="rounded bg-white px-2 text-black font-bold"
                aria-label={`${team.name} pontjainak csökkentése`}
              >
                –
              </button>
              <button
                onClick={() => openScoreEditor(i)}
                className="grid size-6 place-items-center rounded bg-white text-black"
                aria-label={`${team.name} pontszámának szerkesztése`}
              >
                <FaPen size={11} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      ))}
      {editingTeam !== null ? (
        <div
          className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="score-editor-title"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveScore();
            }}
            className="w-full max-w-sm rounded-2xl border-2 border-[#24211c] bg-[#fff4d6] p-6 text-[#24211c] shadow-[0_6px_0_#24211c]"
          >
            <h2 id="score-editor-title" className="font-display text-2xl">
              {teams[editingTeam].name} pontszáma
            </h2>
            <label className="mt-5 block font-bold" htmlFor="team-score">
              Pontszám
            </label>
            <input
              id="team-score"
              type="number"
              step="1"
              value={scoreInput}
              onChange={(event) => setScoreInput(event.target.value)}
              autoFocus
              className="mt-2 w-full rounded-lg border-2 border-[#24211c] bg-white px-3 py-2 text-lg"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingTeam(null)}
                className="rounded-lg border-2 border-[#24211c] px-4 py-2 font-bold"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="rounded-lg border-2 border-[#24211c] bg-[#ffd75a] px-4 py-2 font-bold shadow-[0_3px_0_#24211c]"
              >
                Mentés
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
