import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaArrowLeft, FaFolderOpen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../api/client";
import { useQuiz } from "../context/QuizContext";
import { Category, Settings } from "../context/types";
import { useConfirm } from "../context/useConfirm";
import { useCurrentUser } from "../context/useCurrentUser";
import { defaultQuizAppearance } from "../utility/quizAppearance";
import { buildCategoriesFromPersistedQuestions } from "../utility/quizPersistence";
import UserSwitcher from "./UserSwitcher";

export default function SavedQuizzes() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { loadQuiz } = useQuiz();
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const {
    data,
    error,
    isPending: isLoadingQuizzes,
    refetch: refetchQuizzes,
  } = useQuery({
    enabled: Boolean(currentUser),
    queryFn: () => api.getQuizzes(currentUser?.user_id),
    queryKey: ["quizzes", currentUser?.user_id],
  });
  const quizzes = data?.quizzes ?? [];
  const deleteQuiz = useMutation({
    mutationFn: (quizId: string) =>
      api.deleteQuiz(quizId, currentUser?.user_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizzes"] }),
  });

  if (isLoadingCurrentUser || isLoadingQuizzes) {
    return (
      <div className="p-8 text-center text-[#24211c]">Kvízek betöltése...</div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-[#b83e18]">
        <h1 className="text-2xl font-bold">Nincs kiválasztott felhasználó</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-[#b83e18]">
        <h1 className="text-2xl font-bold">
          Nem sikerült betölteni a kvízeket
        </h1>
        <p className="mt-2 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-black">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-4xl text-[#24211c]">
              Mentett kvízek
            </h1>
            <p className="text-sm text-[#756b5c]">
              Csak a(z){" "}
              {currentUser.display_name ||
                currentUser.email ||
                "aktív felhasználó"}{" "}
              saját kvízei látszanak.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
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
              const quizQuestions = quiz.questions;
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
                          {
                            classicMode: quiz.classic_mode ?? true,
                            timerEnabled: quiz.timer_enabled ?? false,
                            timerDuration: quiz.timer_duration ?? 30,
                          } satisfies Settings,
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
                        const shouldDelete = await confirm({
                          confirmLabel: "Kvíz törlése",
                          description: `A(z) „${quiz.title}” kvíz és minden kérdése végleg törlődik.`,
                          destructive: true,
                          title: "Kvíz törlése",
                        });

                        if (!shouldDelete) {
                          return;
                        }

                        try {
                          await deleteQuiz.mutateAsync(quiz.quiz_id);
                          await refetchQuizzes();
                          toast.success("A kvíz törölve.");
                        } catch (mutationError) {
                          const message =
                            mutationError instanceof Error
                              ? mutationError.message
                              : "Ismeretlen törlési hiba.";
                          toast.error(`A törlés nem sikerült: ${message}`);
                        }
                      }}
                      disabled={deleteQuiz.isPending}
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
