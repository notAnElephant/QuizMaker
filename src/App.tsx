import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useCallback, useEffect, useRef } from "react";
import {
  FaCog,
  FaEdit,
  FaFolderOpen,
  FaPlus,
  FaSave,
  FaTrophy,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Board } from "./components/Board";
import TeamBar from "./components/TeamBar.tsx";
import UserSwitcher from "./components/UserSwitcher";
import { useQuiz } from "./context/QuizContext";
import { useCurrentUser } from "./context/useCurrentUser";
import { buildStoredQuestionText } from "./utility/quizPersistence";

const CREATE_QUIZ_MUTATION = gql`
  mutation CreateQuiz(
    $quizId: uuid!
    $title: String!
    $description: String
    $ownerId: uuid!
    $questions: [questions_insert_input!]!
  ) {
    insert_quizzes_one(
      object: {
        quiz_id: $quizId
        title: $title
        description: $description
        owner_id: $ownerId
      }
    ) {
      quiz_id
    }
    insert_questions(objects: $questions) {
      affected_rows
    }
  }
`;

const UPDATE_QUIZ_MUTATION = gql`
  mutation UpdateQuiz(
    $quizId: uuid!
    $title: String!
    $description: String
    $ownerId: uuid!
    $questions: [questions_insert_input!]!
    $updatedAt: timestamp!
  ) {
    update_quizzes(
      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }
      _set: { title: $title, description: $description, updated_at: $updatedAt }
    ) {
      affected_rows
    }
    delete_questions(where: { quiz_id: { _eq: $quizId } }) {
      affected_rows
    }
    insert_questions(objects: $questions) {
      affected_rows
    }
  }
`;

const SAVE_QUIZ_PLAYS_MUTATION = gql`
  mutation SaveQuizPlays($plays: [quiz_plays_insert_input!]!) {
    insert_quiz_plays(objects: $plays) {
      affected_rows
    }
  }
`;

function SidebarAction({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-black/85 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </div>
    </div>
  );
}

function App() {
  const {
    categories,
    currentQuizId,
    currentQuizTitle,
    markUsed,
    playReadyToSave,
    playSaveStatus,
    playSessionId,
    renameQuiz,
    setCurrentQuizId,
    setPlaySaveStatus,
    teams,
  } = useQuiz();
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [createQuiz, { loading: isCreatingQuiz }] =
    useMutation(CREATE_QUIZ_MUTATION);
  const [updateQuiz, { loading: isUpdatingQuiz }] =
    useMutation(UPDATE_QUIZ_MUTATION);
  const [saveQuizPlays, { loading: isSavingPlays }] = useMutation(
    SAVE_QUIZ_PLAYS_MUTATION,
  );
  const playSaveStartedForSession = useRef<string | null>(null);
  const allQuestionsUsed = categories.every((category) =>
    category.questions.every((question) => question.isUsed),
  );
  const isSaving = isCreatingQuiz || isUpdatingQuiz;

  const persistQuiz = useCallback(
    async (askForTitle: boolean) => {
      if (!currentUser) {
        throw new Error("Nincs kiválasztott felhasználó a mentéshez.");
      }

      const defaultTitle =
        currentQuizTitle ||
        `Mentett kvíz ${new Date().toLocaleString("hu-HU")}`;
      const title = askForTitle
        ? window.prompt("Kvíz címe", defaultTitle)?.trim()
        : defaultTitle.trim();

      if (!title) {
        return null;
      }

      const quizId = currentQuizId ?? crypto.randomUUID();
      const questions = categories.flatMap((category) =>
        category.questions.map((question) => ({
          question_id: crypto.randomUUID(),
          quiz_id: quizId,
          category_name: category.category,
          question_text: buildStoredQuestionText(
            question.content,
            question.source,
          ),
          question_type: question.type,
          points: question.points,
          answer_options: question.list?.length ? question.list : [],
        })),
      );
      const variables = {
        quizId,
        title,
        description: `${categories.length} kategória, ${questions.length} kérdés`,
        ownerId: currentUser.user_id,
        questions,
      };

      if (currentQuizId) {
        await updateQuiz({
          variables: {
            ...variables,
            updatedAt: new Date().toISOString(),
          },
        });
      } else {
        await createQuiz({ variables });
      }

      setCurrentQuizId(quizId);
      renameQuiz(title);
      return { quizId, title, wasUpdate: Boolean(currentQuizId) };
    },
    [
      categories,
      createQuiz,
      currentQuizId,
      currentQuizTitle,
      currentUser,
      renameQuiz,
      setCurrentQuizId,
      updateQuiz,
    ],
  );

  const handleSaveQuiz = async () => {
    try {
      const result = await persistQuiz(true);
      if (!result) {
        return;
      }

      window.alert(
        `A(z) "${result.title}" kvíz ${result.wasUpdate ? "frissítve" : "elmentve"}.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ismeretlen mentési hiba.";
      window.alert(`A mentés nem sikerült: ${message}`);
    }
  };

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
        : await persistQuiz(false);

      if (!persistedQuiz) {
        throw new Error("A kvízt nem sikerült elmenteni a lejátszás előtt.");
      }

      const playedAt = new Date().toISOString();
      const plays = teams.length
        ? teams.map((team) => ({
            play_id: crypto.randomUUID(),
            session_id: playSessionId,
            quiz_id: persistedQuiz.quizId,
            play_time: playedAt,
            score: team.points,
            team_name: team.name,
            team_score: team.points,
            user_id: currentUser.user_id,
          }))
        : [
            {
              play_id: crypto.randomUUID(),
              session_id: playSessionId,
              quiz_id: persistedQuiz.quizId,
              play_time: playedAt,
              score: 0,
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
      const message =
        error instanceof Error ? error.message : "Ismeretlen mentési hiba.";
      window.alert(`A lejátszás mentése nem sikerült: ${message}`);
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

  const playSaveLabel =
    playSaveStatus === "saved"
      ? "Lejátszás automatikusan elmentve"
      : playSaveStatus === "saving"
        ? "Lejátszás mentése..."
        : playSaveStatus === "error"
          ? "Mentés újrapróbálása"
          : "A lejátszás automatikusan mentésre kerül";

  return (
    <div className="min-h-screen flex items-center flex-col justify-between text-black">
      <div className="w-full h-full max-w-5xl px-4 flex flex-col items-center text-center">
        <div className="mt-8 flex w-full justify-end">
          <UserSwitcher />
        </div>
        <h1 className="text-6xl font-bold mb-8 mt-16 font-display">
          {currentQuizTitle}
        </h1>
        <Board
          data={categories}
          font="font-display"
          onSelect={(catIndex, qIndex, used) =>
            markUsed(catIndex, qIndex, used)
          }
        />
      </div>
      <div className="absolute bottom-4 left-4 flex-1 flex items-start gap-2 flex-col">
        <SidebarAction label="Kvíz mentése">
          <button
            onClick={handleSaveQuiz}
            disabled={isSaving || isLoadingCurrentUser || !currentUser}
            className="bg-emerald-700 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 disabled:cursor-wait disabled:bg-emerald-400"
            aria-label="Save quiz"
            title="Kvíz mentése"
          >
            <FaSave size={20} />
          </button>
        </SidebarAction>
        <SidebarAction label={playSaveLabel}>
          <button
            onClick={() => void handleSaveCompletedPlay()}
            disabled={
              isSavingPlays ||
              isLoadingCurrentUser ||
              !currentUser ||
              !allQuestionsUsed ||
              playSaveStatus === "saving" ||
              playSaveStatus === "saved"
            }
            className="bg-yellow-600 text-white p-3 rounded-full shadow-lg hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300"
            aria-label="Save game results"
            title={playSaveLabel}
          >
            <FaTrophy size={20} />
          </button>
        </SidebarAction>
        <SidebarAction label="Mentett kvíz betöltése">
          <button
            onClick={() => navigate("/quizzes")}
            className="bg-blue-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
            aria-label="Load quiz"
            title="Mentett kvíz betöltése"
          >
            <FaFolderOpen size={20} />
          </button>
        </SidebarAction>
        <SidebarAction label="Új kvíz létrehozása">
          <button
            onClick={() => navigate("/quizzes/new")}
            className="bg-fuchsia-700 text-white p-3 rounded-full shadow-lg hover:bg-fuchsia-600"
            aria-label="New quiz"
            title="Új kvíz létrehozása"
          >
            <FaPlus size={20} />
          </button>
        </SidebarAction>
        <SidebarAction label="Pontszámok szerkesztése">
          <button
            onClick={() => navigate("/editor")}
            className="bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-500"
            aria-label="Edit quiz"
            title="Pontszámok szerkesztése"
          >
            <FaEdit size={20} />
          </button>
        </SidebarAction>
        <SidebarAction label="Csapatok">
          <button
            onClick={() => navigate("/teams")}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
            aria-label="Teams"
            title="Csapatok"
          >
            <FaUsers size={20} />
          </button>
        </SidebarAction>
        <SidebarAction label="Profil">
          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
            aria-label="Profile"
            title="Profil"
          >
            <FaUser size={20} />
          </button>
        </SidebarAction>
        <SidebarAction label="Beállítások">
          <button
            onClick={() => navigate("/settings")}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
            aria-label="Settings"
            title="Beállítások"
          >
            <FaCog size={20} />
          </button>
        </SidebarAction>
      </div>
      <TeamBar mode="board" />
    </div>
  );
}

export default App;
