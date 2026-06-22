import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { FaArrowLeft, FaFolderOpen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { Category } from "../context/types";
import { buildCategoriesFromPersistedQuestions } from "../utility/quizPersistence";

const GET_SAVED_QUIZZES_QUERY = gql`
  query GetSavedQuizzes {
    quizzes(order_by: [{ updated_at: desc }]) {
      quiz_id
      title
      description
      updated_at
    }
    questions(order_by: [{ category_name: asc }, { points: asc }]) {
      question_id
      quiz_id
      question_text
      question_type
      points
      answer_options
      category_name
    }
  }
`;

const DELETE_QUIZ_MUTATION = gql`
  mutation DeleteQuiz($quizId: uuid!) {
    delete_quizzes(where: { quiz_id: { _eq: $quizId } }) {
      affected_rows
    }
  }
`;

type SavedQuizQuestion = {
  answer_options?: string[] | null;
  category_name: string;
  points?: number | null;
  question_id: string;
  question_text: string;
  question_type: string;
  quiz_id?: string | null;
};

type SavedQuiz = {
  description?: string | null;
  quiz_id: string;
  title: string;
  updated_at: string;
};

type SavedQuizzesQueryResult = {
  questions: SavedQuizQuestion[];
  quizzes: SavedQuiz[];
};

export default function SavedQuizzes() {
  const navigate = useNavigate();
  const { loadQuiz } = useQuiz();
  const { data, loading, error, refetch } =
    useQuery<SavedQuizzesQueryResult>(GET_SAVED_QUIZZES_QUERY);
  const [deleteQuiz, { loading: isDeleting }] =
    useMutation(DELETE_QUIZ_MUTATION);

  if (loading) {
    return <div className="p-8 text-center text-white">Kvízek betöltése...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-100">
        <h1 className="text-2xl font-bold">Nem sikerült betölteni a kvízeket</h1>
        <p className="mt-2 text-sm">{error.message}</p>
      </div>
    );
  }

  const quizzes = data?.quizzes ?? [];
  const questions = data?.questions ?? [];

  return (
    <div className="min-h-screen p-8 text-black">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-display text-white">Mentett kvízek</h1>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-gray-800 p-3 text-white shadow-lg hover:bg-gray-700"
            aria-label="Back"
          >
            <FaArrowLeft size={18} />
          </button>
        </div>

        {!quizzes.length ? (
          <div className="rounded-2xl bg-white/90 p-8 text-center shadow">
            Még nincs mentett kvíz.
          </div>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz) => {
              const quizQuestions = questions.filter(
                (question) => question.quiz_id === quiz.quiz_id,
              );
              const categories: Category[] =
                buildCategoriesFromPersistedQuestions(quizQuestions);
              const questionCount = quizQuestions.length;

              return (
                <div
                  key={quiz.quiz_id}
                  className="rounded-2xl bg-white/92 p-5 shadow"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{quiz.title}</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {categories.length} kategória, {questionCount} kérdés
                      </p>
                      {quiz.description ? (
                        <p className="mt-2 text-sm text-gray-700">
                          {quiz.description}
                        </p>
                      ) : null}
                    </div>

                    <button
                      onClick={() => {
                        loadQuiz(quiz.title, categories);
                        navigate("/");
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
                    >
                      <FaFolderOpen size={16} />
                      Betöltés
                    </button>
                    <button
                      onClick={async () => {
                        const shouldDelete = window.confirm(
                          `Biztosan törlöd ezt a kvízt?\n\n${quiz.title}`,
                        );

                        if (!shouldDelete) {
                          return;
                        }

                        try {
                          await deleteQuiz({
                            variables: { quizId: quiz.quiz_id },
                          });
                          await refetch();
                        } catch (mutationError) {
                          const message =
                            mutationError instanceof Error
                              ? mutationError.message
                              : "Ismeretlen törlési hiba.";
                          window.alert(`A törlés nem sikerült: ${message}`);
                        }
                      }}
                      disabled={isDeleting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:cursor-wait disabled:bg-red-400"
                    >
                      <FaTrash size={16} />
                      Törlés
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
