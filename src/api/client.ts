import { firebaseAuth } from "../firebase";
import type { ApiUser, PlaySessionInput, QuizInput, SavedQuiz } from "./types";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

type RequestOptions = {
  body?: unknown;
  localUserId?: string | null;
  method?: "DELETE" | "GET" | "POST" | "PUT";
};

export async function apiRequest<T>(
  path: string,
  { body, localUserId, method = "GET" }: RequestOptions = {},
): Promise<T> {
  const token = await firebaseAuth?.currentUser?.getIdToken();
  const response = await fetch(`${API_URL}/api${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      ...(body === undefined ? {} : { "content-type": "application/json" }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(!token && localUserId ? { "x-local-user-id": localUserId } : {}),
    },
    method,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody && typeof errorBody.message === "string"
        ? errorBody.message
        : `API request failed (${response.status})`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  createQuiz: (quizId: string, input: QuizInput, localUserId?: string | null) =>
    apiRequest<{ quiz: SavedQuiz }>("/quizzes", {
      body: { ...input, quiz_id: quizId },
      localUserId,
      method: "POST",
    }),
  deleteQuiz: (quizId: string, localUserId?: string | null) =>
    apiRequest<void>(`/quizzes/${quizId}`, {
      localUserId,
      method: "DELETE",
    }),
  getQuizzes: (localUserId?: string | null) =>
    apiRequest<{ quizzes: SavedQuiz[] }>("/quizzes", { localUserId }),
  getUsers: () => apiRequest<{ users: ApiUser[] }>("/users"),
  savePlaySession: (input: PlaySessionInput, localUserId?: string | null) =>
    apiRequest<{ saved: number }>("/play-sessions", {
      body: input,
      localUserId,
      method: "POST",
    }),
  syncCurrentUser: (user: Omit<ApiUser, "user_id">) =>
    apiRequest<{ user: ApiUser }>("/users/me", {
      body: user,
      method: "PUT",
    }),
  updateQuiz: (quizId: string, input: QuizInput, localUserId?: string | null) =>
    apiRequest<{ quiz: SavedQuiz }>(`/quizzes/${quizId}`, {
      body: input,
      localUserId,
      method: "PUT",
    }),
};
