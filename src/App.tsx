import { gql } from "@apollo/client";
import "./index.css";
import { useMutation } from "@apollo/client/react";
import { FaCog, FaEdit, FaFolderOpen, FaPlus, FaSave, FaTrophy, FaUser, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Board } from "./components/Board";
import TeamBar from "./components/TeamBar.tsx";
import UserSwitcher from "./components/UserSwitcher";
import { useQuiz } from "./context/QuizContext";
import { useCurrentUser } from "./context/useCurrentUser";
import { buildStoredQuestionText } from "./utility/quizPersistence";

const SAVE_QUIZ_MUTATION = gql`
  mutation SaveQuiz(
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
      title
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
    setCurrentQuizId,
    teams,
  } = useQuiz();
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [saveQuiz, { loading: isSaving }] = useMutation(SAVE_QUIZ_MUTATION);
  const [saveQuizPlays, { loading: isSavingPlays }] = useMutation(
    SAVE_QUIZ_PLAYS_MUTATION,
  );
  const allQuestionsUsed = categories.every((category) =>
    category.questions.every((question) => question.isUsed),
  );

  const handleSaveQuiz = async () => {
    if (!currentUser) {
      window.alert("Nincs kiválasztott felhasználó a mentéshez.");
      return;
    }

    const defaultTitle =
      currentQuizTitle || `Mentett kvíz ${new Date().toLocaleString("hu-HU")}`;
    const title = window.prompt("Kvíz címe", defaultTitle)?.trim();

    if (!title) {
      return;
    }

    const quizId = crypto.randomUUID();
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

    try {
      await saveQuiz({
        variables: {
          quizId,
          title,
          description: `${categories.length} kategória, ${questions.length} kérdés`,
          ownerId: currentUser.user_id,
          questions,
        },
      });

      setCurrentQuizId(quizId);
      window.alert(`A(z) "${title}" kvíz el lett mentve.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ismeretlen mentési hiba.";
      window.alert(`A mentés nem sikerült: ${message}`);
    }
  };

  const handleSaveCompletedPlay = async () => {
    if (!currentUser) {
      window.alert("Nincs kiválasztott felhasználó a játék mentéséhez.");
      return;
    }

    if (!currentQuizId) {
      window.alert("A játék mentése előtt mentsd el a kvízt.");
      return;
    }

    if (!allQuestionsUsed) {
      window.alert(
        "A lejátszás csak akkor menthető, ha minden kérdés fel lett fedve.",
      );
      return;
    }

    try {
      await saveQuizPlays({
        variables: {
          plays: teams.map((team) => ({
            play_id: crypto.randomUUID(),
            quiz_id: currentQuizId,
            score: team.points,
            team_name: team.name,
            team_score: team.points,
            user_id: currentUser.user_id,
          })),
        },
      });

      window.alert("A lejátszás eredményei el lettek mentve az adatbázisba.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ismeretlen mentési hiba.";
      window.alert(`A lejátszás mentése nem sikerült: ${message}`);
    }
  };

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
        <SidebarAction label="Lejátszás mentése">
          <button
            onClick={handleSaveCompletedPlay}
            disabled={
              isSavingPlays ||
              isLoadingCurrentUser ||
              !currentUser ||
              !allQuestionsUsed
            }
            className="bg-yellow-600 text-white p-3 rounded-full shadow-lg hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-300"
            aria-label="Save game results"
            title="Lejátszás mentése"
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
      <TeamBar mode={"board"} />
    </div>
  );
}

export default App;
