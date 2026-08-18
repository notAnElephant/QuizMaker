import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { FaArrowLeft, FaFolderOpen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { Category, QuizAppearance } from "../context/types";
import { useCurrentUser } from "../context/useCurrentUser";
import { buildCategoriesFromPersistedQuestions } from "../utility/quizPersistence";
import { defaultQuizAppearance } from "../utility/quizAppearance";
import UserSwitcher from "./UserSwitcher";

const GET_SAVED_QUIZZES_QUERY = gql`
  query GetSavedQuizzes($ownerId: uuid!) {
    quizzes(
      where: { owner_id: { _eq: $ownerId } }
      order_by: [{ updated_at: desc }]
    ) {
      quiz_id
      title
      description
      background_mode
      background_preset
      background_image
      text_color
      updated_at
    }
  }
`;

const GET_SAVED_QUIZ_QUESTIONS_QUERY = gql`
  query GetSavedQuizQuestions($quizIds: [uuid!]!) {
    questions(
      where: { quiz_id: { _in: $quizIds } }
      order_by: [{ category_name: asc }, { points: asc }]
    ) {
      question_id
      quiz_id
      question_text
      question_type
      points
      answer_options
      answer_media_source
      answer_media_type
      correct_answer
      reveal_answer
      category_name
    }
  }
`;

const DELETE_QUIZ_MUTATION = gql`
  mutation DeleteQuiz($quizId: uuid!, $ownerId: uuid!) {
    delete_quizzes(
      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }
    ) {
      affected_rows
    }
  }
`;

type SavedQuizQuestion = {
  answer_options?: string[] | null;
  answer_media_source?: string | null;
  answer_media_type?: string | null;
  category_name: string;
  correct_answer?: string | null;
  points?: number | null;
  question_id: string;
  question_text: string;
  question_type: string;
  reveal_answer?: boolean | null;
  quiz_id?: string | null;
};

type SavedQuiz = {
  background_image?: string | null;
  background_mode?: QuizAppearance["backgroundMode"] | null;
  background_preset?: QuizAppearance["backgroundPreset"] | null;
  description?: string | null;
  quiz_id: string;
  title: string;
  text_color?: string | null;
  updated_at: string;
};

type SavedQuizzesQueryResult = {
  quizzes: SavedQuiz[];
};

type SavedQuizQuestionsQueryResult = {
  questions: SavedQuizQuestion[];
};

export default function SavedQuizzes() {
  const navigate = useNavigate();
  const { loadQuiz } = useQuiz();
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const {
    data,
    loading,
    error,
    refetch: refetchQuizzes,
  } = useQuery<SavedQuizzesQueryResult>(GET_SAVED_QUIZZES_QUERY, {
    skip: !currentUser,
    variables: currentUser ? { ownerId: currentUser.user_id } : undefined,
  });
  const quizzes = data?.quizzes ?? [];
  const quizIds = quizzes.map((quiz) => quiz.quiz_id);
  const {
    data: questionsData,
    loading: isLoadingQuestions,
    error: questionsError,
  } = useQuery<SavedQuizQuestionsQueryResult>(GET_SAVED_QUIZ_QUESTIONS_QUERY, {
    skip: !quizIds.length,
    variables: { quizIds },
  });
  const [deleteQuiz, { loading: isDeleting }] =
    useMutation(DELETE_QUIZ_MUTATION);

  if (isLoadingCurrentUser || loading || isLoadingQuestions) {
    return (
      <div className="p-8 text-center text-white">Kvízek betöltése...</div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-red-100">
        <h1 className="text-2xl font-bold">Nincs kiválasztott felhasználó</h1>
      </div>
    );
  }

  if (error || questionsError) {
    return (
      <div className="p-8 text-center text-red-100">
        <h1 className="text-2xl font-bold">
          Nem sikerült betölteni a kvízeket
        </h1>
        <p className="mt-2 text-sm">
          {error?.message ?? questionsError?.message}
        </p>
      </div>
    );
  }

  const questions = questionsData?.questions ?? [];

  return (
    <div className="min-h-screen p-8 text-black">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-display text-white">Mentett kvízek</h1>
            <p className="text-sm text-white/80">
              Csak a(z){" "}
              {currentUser.display_name ||
                currentUser.email ||
                "aktív felhasználó"}{" "}
              saját kvízei látszanak.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <UserSwitcher />
            <button
              onClick={() => navigate("/")}
              className="rounded-full bg-gray-800 p-3 text-white shadow-lg hover:bg-gray-700"
              aria-label="Back"
            >
              <FaArrowLeft size={18} />
            </button>
          </div>
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
                        loadQuiz(
                          quiz.quiz_id,
                          quiz.title,
                          quiz.description ?? "",
                          categories,
                          {
                            backgroundImage: quiz.background_image ?? undefined,
                            backgroundMode:
                              quiz.background_mode ??
                              defaultQuizAppearance.backgroundMode,
                            backgroundPreset:
                              quiz.background_preset ??
                              defaultQuizAppearance.backgroundPreset,
                            textColor:
                              quiz.text_color ??
                              defaultQuizAppearance.textColor,
                          },
                        );
                        navigate("/editor");
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
                            variables: {
                              ownerId: currentUser.user_id,
                              quizId: quiz.quiz_id,
                            },
                          });
                          await refetchQuizzes();
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
