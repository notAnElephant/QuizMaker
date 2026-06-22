import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { FaArrowLeft, FaFolderOpen, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../context/useCurrentUser";
import UserSwitcher from "./UserSwitcher";

const GET_PROFILE_QUIZZES_QUERY = gql`
  query GetProfileQuizzes($ownerId: uuid!) {
    quizzes(
      where: { owner_id: { _eq: $ownerId } }
      order_by: [{ updated_at: desc }]
    ) {
      quiz_id
      title
      description
      updated_at
    }
  }
`;

type ProfileQuiz = {
  description?: string | null;
  quiz_id: string;
  title: string;
  updated_at: string;
};

type ProfileQuizzesQueryResult = {
  quizzes: ProfileQuiz[];
};

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
  const { data, loading, error } = useQuery<ProfileQuizzesQueryResult>(
    GET_PROFILE_QUIZZES_QUERY,
    {
      skip: !currentUser,
      variables: currentUser ? { ownerId: currentUser.user_id } : undefined,
    },
  );

  if (isLoadingCurrentUser || loading) {
    return <div className="p-8 text-center text-white">Profil betöltése...</div>;
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-red-100">
        <h1 className="text-2xl font-bold">Nincs kiválasztott felhasználó</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-100">
        <h1 className="text-2xl font-bold">Nem sikerült betölteni a profilt</h1>
        <p className="mt-2 text-sm">{error.message}</p>
      </div>
    );
  }

  const quizzes = data?.quizzes ?? [];

  return (
    <div className="min-h-screen p-8 text-black">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-display text-white">Profil</h1>
            <p className="text-sm text-white/80">
              Itt látszanak az aktív felhasználóhoz tartozó mentett kvízek.
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

        <section className="rounded-2xl bg-white/92 p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-gray-900 p-4 text-white">
              <FaUser size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {currentUser.display_name || "Névtelen felhasználó"}
              </h2>
              <p className="text-sm text-gray-600">
                {currentUser.email || "Nincs e-mail cím megadva"}
              </p>
              <p className="mt-2 text-sm text-gray-700">
                Mentett kvízek száma: {quizzes.length}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white/92 p-6 shadow">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Mentett kvízek</h2>
              <p className="mt-1 text-sm text-gray-600">
                Ezek a kvízek ehhez a felhasználóhoz tartoznak.
              </p>
            </div>
            <button
              onClick={() => navigate("/quizzes")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
            >
              <FaFolderOpen size={16} />
              Kvízlista
            </button>
          </div>

          {!quizzes.length ? (
            <div className="mt-4 rounded-xl bg-gray-100 p-5 text-center text-gray-600">
              Ehhez a felhasználóhoz még nincs mentett kvíz.
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.quiz_id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <h3 className="text-lg font-bold">{quiz.title}</h3>
                  {quiz.description ? (
                    <p className="mt-1 text-sm text-gray-700">
                      {quiz.description}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
                    Utolsó frissítés:{" "}
                    {new Date(quiz.updated_at).toLocaleString("hu-HU")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
