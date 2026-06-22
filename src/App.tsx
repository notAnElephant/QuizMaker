import { gql } from "@apollo/client";
import "./index.css";
import { useMutation } from "@apollo/client/react";
import { Board } from "./components/Board";
import { useQuiz } from "./context/QuizContext";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSave, FaUsers } from "react-icons/fa";
import TeamBar from "./components/TeamBar.tsx";

const SAVE_QUIZ_MUTATION = gql`
  mutation SaveQuiz(
    $quizId: uuid!
    $title: String!
    $description: String
    $questions: [questions_insert_input!]!
  ) {
    insert_quizzes_one(
      object: { quiz_id: $quizId, title: $title, description: $description }
    ) {
      quiz_id
      title
    }
    insert_questions(objects: $questions) {
      affected_rows
    }
  }
`;

const buildStoredQuestionText = (content: string, source?: string) =>
  source ? `${content} [SOURCE: ${source}]` : content;

function App() {
  const { categories, markUsed } = useQuiz();
  const navigate = useNavigate();
  const [saveQuiz, { loading: isSaving }] = useMutation(SAVE_QUIZ_MUTATION);

  const handleSaveQuiz = async () => {
    const defaultTitle = `Mentett kvíz ${new Date().toLocaleString("hu-HU")}`;
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
        question_text: buildStoredQuestionText(question.content, question.source),
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
          questions,
        },
      });

      window.alert(`A(z) "${title}" kvíz el lett mentve.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ismeretlen mentési hiba.";
      window.alert(`A mentés nem sikerült: ${message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center flex-col justify-between text-black">
      <div className="w-full h-full max-w-screen-lg px-4 flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold mb-8 mt-16 font-display">
          Vágó Pesta
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
        <button
          onClick={handleSaveQuiz}
          disabled={isSaving}
          className="bg-emerald-700 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 disabled:cursor-wait disabled:bg-emerald-400"
          aria-label="Save quiz"
          title="Kvíz mentése"
        >
          <FaSave size={20} />
        </button>
        <button
          onClick={() => navigate("/teams")}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
          aria-label="Teams"
        >
          <FaUsers size={20} />
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
          aria-label="Settings"
        >
          <FaCog size={20} />
        </button>
      </div>
      <TeamBar mode={"board"} />
    </div>
  );
}

export default App;
