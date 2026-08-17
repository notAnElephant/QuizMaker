import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useCallback, useEffect, useRef } from "react";
import { FaCheck, FaRedo, FaSpinner } from "react-icons/fa";
import "./index.css";
import { Board } from "./components/Board";
import TeamBar from "./components/TeamBar";
import { useQuiz } from "./context/QuizContext";
import { useCurrentUser } from "./context/useCurrentUser";
import { useQuizPersistence } from "./hooks/useQuizPersistence";

const SAVE_QUIZ_PLAYS_MUTATION = gql`
  mutation SaveQuizPlays($plays: [quiz_plays_insert_input!]!) {
    insert_quiz_plays(objects: $plays) {
      affected_rows
    }
  }
`;

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
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const { persistQuiz } = useQuizPersistence();
  const [saveQuizPlays, { loading: isSavingPlays }] = useMutation(
    SAVE_QUIZ_PLAYS_MUTATION,
  );
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

    try {
      const persistedQuiz = currentQuizId
        ? { quizId: currentQuizId }
        : await persistQuiz();
      const playedAt = new Date().toISOString();
      const plays = teams.length
        ? teams.map((team) => ({
            play_id: crypto.randomUUID(),
            play_time: playedAt,
            quiz_id: persistedQuiz.quizId,
            score: team.points,
            session_id: playSessionId,
            team_name: team.name,
            team_score: team.points,
            user_id: currentUser.user_id,
          }))
        : [
            {
              play_id: crypto.randomUUID(),
              play_time: playedAt,
              quiz_id: persistedQuiz.quizId,
              score: 0,
              session_id: playSessionId,
              team_name: null,
              team_score: 0,
              user_id: currentUser.user_id,
            },
          ];

      await saveQuizPlays({ variables: { plays } });
      setPlaySaveStatus("saved");
    } catch (error) {
      playSaveStartedForSession.current = null;
      setPlaySaveStatus("error");
      console.error("A lejátszás mentése nem sikerült", error);
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
      <div className="flex h-full w-full max-w-5xl flex-col items-center px-2 text-center sm:px-4">
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

      {playSaveStatus !== "idle" ? (
        <div
          aria-live="polite"
          className="fixed right-4 top-4 z-30 rounded-lg border-2 border-[#24211c] bg-[#fff4d6] px-3 py-2 text-sm font-semibold text-[#24211c] shadow-[0_3px_0_#24211c]"
        >
          {playSaveStatus === "saving" ? (
            <span className="inline-flex items-center gap-2">
              <FaSpinner className="animate-spin" aria-hidden="true" />
              Lejátszás mentése…
            </span>
          ) : playSaveStatus === "saved" ? (
            <span className="inline-flex items-center gap-2">
              <FaCheck aria-hidden="true" />
              Lejátszás elmentve
            </span>
          ) : (
            <button
              onClick={() => void handleSaveCompletedPlay()}
              disabled={isSavingPlays || isLoadingCurrentUser || !currentUser}
              className="inline-flex items-center gap-2 underline decoration-2 underline-offset-2 disabled:opacity-50"
            >
              <FaRedo aria-hidden="true" />
              Mentés újrapróbálása
            </button>
          )}
        </div>
      ) : null}

      <TeamBar mode="board" />
    </main>
  );
}

export default App;
