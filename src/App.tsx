import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./index.css";
import { api } from "./api/client";
import { Board } from "./components/Board";
import TeamBar from "./components/TeamBar";
import { useQuiz } from "./context/QuizContext";
import { useCurrentUser } from "./context/useCurrentUser";
import { useQuizPersistence } from "./hooks/useQuizPersistence";

function SidebarAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="group relative flex items-center">
      <button
        aria-label={label}
        className="rounded-full bg-gray-800 p-3 text-white shadow-lg hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={onClick}
        title={label}
        type="button"
      >
        {icon}
      </button>
      <div className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-black/85 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </div>
    </div>
  );
}

function App() {
  const {
    appearance,
    categories,
    currentQuizId,
    currentQuizTitle,
    markUsed,
    playReadyToSave,
    playSaveStatus,
    playSessionId,
    setPlaySaveStatus,
    teams,
  } = useQuiz();
  const { currentUser } = useCurrentUser();
  const { persistQuiz } = useQuizPersistence();
  const navigate = useNavigate();
  const saveQuizPlays = useMutation({
    mutationFn: (input: Parameters<typeof api.savePlaySession>[0]) =>
      api.savePlaySession(input, currentUser?.user_id),
  });
  const playSaveStartedForSession = useRef<string | null>(null);
  const allQuestionsUsed = categories.every((category) =>
    category.questions.every((question) => question.isUsed),
  );

  const handleSaveCompletedPlay = useCallback(async () => {
    if (
      !currentUser ||
      !allQuestionsUsed ||
      playSaveStartedForSession.current === playSessionId
    ) {
      return;
    }

    playSaveStartedForSession.current = playSessionId;
    setPlaySaveStatus("saving");
    const saveToastId = toast.loading("Lejátszás mentése…", {
      id: `play-save-${playSessionId}`,
    });

    try {
      const persistedQuiz = currentQuizId
        ? { quizId: currentQuizId }
        : await persistQuiz();
      const playedAt = new Date().toISOString();
      const plays = teams.length
        ? teams.map((team) => ({
            play_id: crypto.randomUUID(),
            score: team.points,
            team_name: team.name,
            team_score: team.points,
          }))
        : [
            {
              play_id: crypto.randomUUID(),
              score: 0,
              team_name: null,
              team_score: 0,
            },
          ];

      await saveQuizPlays.mutateAsync({
        played_at: playedAt,
        plays,
        quiz_id: persistedQuiz.quizId,
        session_id: playSessionId,
      });
      setPlaySaveStatus("saved");
      toast.success("Lejátszás elmentve", { id: saveToastId });
    } catch (error) {
      playSaveStartedForSession.current = null;
      setPlaySaveStatus("error");
      console.error("A lejátszás mentése nem sikerült", error);
      toast.error("A lejátszás mentése nem sikerült.", {
        action: {
          label: "Újrapróbálás",
          onClick: () => setPlaySaveStatus("idle"),
        },
        id: saveToastId,
      });
    }
  }, [
    allQuestionsUsed,
    currentQuizId,
    currentUser,
    persistQuiz,
    playSessionId,
    saveQuizPlays,
    setPlaySaveStatus,
    teams,
  ]);

  useEffect(() => {
    if (playReadyToSave && allQuestionsUsed && playSaveStatus === "idle") {
      void handleSaveCompletedPlay();
    }
  }, [
    allQuestionsUsed,
    handleSaveCompletedPlay,
    playReadyToSave,
    playSaveStatus,
  ]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between"
      style={{ color: appearance.textColor }}
    >
      <div className="flex h-full w-full max-w-5xl flex-col items-center px-2 pl-14 text-center sm:px-4 sm:pl-4">
        <h1 className="readable-on-image mb-6 mt-16 font-display text-4xl font-bold sm:mb-8 sm:mt-24 sm:text-6xl">
          {currentQuizTitle}
        </h1>
        <Board
          data={categories}
          font="font-display readable-on-image"
          onSelect={(catIndex, qIndex, used) =>
            markUsed(catIndex, qIndex, used)
          }
        />
      </div>

      <nav
        aria-label="Game controls"
        className="fixed bottom-4 left-4 z-30 flex flex-col items-start gap-2"
      >
        <SidebarAction
          icon={<FaUsers aria-hidden="true" size={20} />}
          label="Csapatok"
          onClick={() => navigate("/teams")}
        />
        <SidebarAction
          icon={<FaUser aria-hidden="true" size={20} />}
          label="Profil"
          onClick={() => navigate("/profile")}
        />
      </nav>

      <TeamBar mode="board" />
    </main>
  );
}

export default App;
