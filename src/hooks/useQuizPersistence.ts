import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { api } from "../api/client";
import type { QuizInput } from "../api/types";
import { useQuiz } from "../context/QuizContext";
import { useCurrentUser } from "../context/useCurrentUser";
import { buildStoredQuestionText } from "../utility/quizPersistence";

export function useQuizPersistence() {
  const {
    appearance,
    categories,
    currentQuizDescription,
    currentQuizId,
    currentQuizTitle,
    setCurrentQuizId,
    settings,
  } = useQuiz();
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const saveQuiz = useMutation({
    mutationFn: async ({
      input,
      quizId,
      wasUpdate,
    }: {
      input: QuizInput;
      quizId: string;
      wasUpdate: boolean;
    }) =>
      wasUpdate
        ? api.updateQuiz(quizId, input, currentUser?.user_id)
        : api.createQuiz(quizId, input, currentUser?.user_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizzes"] }),
  });

  const persistQuiz = useCallback(async () => {
    if (!currentUser) {
      throw new Error("Nincs kiválasztott felhasználó a mentéshez.");
    }

    const title = currentQuizTitle.trim();
    if (!title) throw new Error("A kvíz címe nem lehet üres.");
    if (!categories.length)
      throw new Error("Adj hozzá legalább egy kategóriát.");
    if (categories.some((category) => !category.category.trim())) {
      throw new Error("Minden kategóriának adj nevet.");
    }

    const quizId = currentQuizId ?? crypto.randomUUID();
    const questions = categories.flatMap((category) =>
      category.questions.map((question) => ({
        answer_options: question.list?.length ? question.list : [],
        answer_media_source: question.answerSource?.trim() || null,
        answer_media_type: question.answerSource
          ? question.answerMediaType || "image"
          : null,
        category_name: category.category,
        correct_answer: question.correctAnswer?.trim() || null,
        points: question.points,
        question_id: crypto.randomUUID(),
        question_text: buildStoredQuestionText(
          question.content,
          question.source,
        ),
        question_type: question.type,
        reveal_answer: question.revealAnswer,
      })),
    );

    const input: QuizInput = {
      background_image:
        appearance.backgroundMode === "image"
          ? appearance.backgroundImage || null
          : null,
      background_mode: appearance.backgroundMode,
      background_preset: appearance.backgroundPreset,
      classic_mode: settings.classicMode,
      description: currentQuizDescription.trim() || null,
      questions,
      text_color: appearance.textColor,
      timer_duration: settings.timerDuration,
      timer_enabled: settings.timerEnabled,
      title,
    };

    await saveQuiz.mutateAsync({
      input,
      quizId,
      wasUpdate: Boolean(currentQuizId),
    });

    if (!currentQuizId) {
      setCurrentQuizId(quizId);
    }

    return { quizId, title, wasUpdate: Boolean(currentQuizId) };
  }, [
    appearance,
    categories,
    currentQuizDescription,
    currentQuizId,
    currentQuizTitle,
    currentUser,
    saveQuiz,
    setCurrentQuizId,
    settings,
  ]);

  return { isSaving: saveQuiz.isPending, persistQuiz };
}
