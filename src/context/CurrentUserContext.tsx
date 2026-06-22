import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { CurrentUserContext } from "./currentUserState";

type CurrentUsersQueryResult = {
  users: {
    display_name?: string | null;
    email?: string | null;
    user_id: string;
  }[];
};

const GET_USERS_QUERY = gql`
  query GetCurrentUsers {
    users(order_by: [{ display_name: asc }, { created_at: asc }]) {
      user_id
      display_name
      email
    }
  }
`;

const STORAGE_KEY = "quizmaker.currentUserId";

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(STORAGE_KEY),
  );
  const { data, loading, error } =
    useQuery<CurrentUsersQueryResult>(GET_USERS_QUERY);

  const users = useMemo(() => data?.users ?? [], [data]);

  useEffect(() => {
    if (!users.length) {
      return;
    }

    const selectedUserStillExists = users.some(
      (user) => user.user_id === selectedUserId,
    );

    if (selectedUserStillExists) {
      return;
    }

    const nextUserId = users[0].user_id;
    setSelectedUserId(nextUserId);
    window.localStorage.setItem(STORAGE_KEY, nextUserId);
  }, [selectedUserId, users]);

  const currentUser = useMemo(
    () => users.find((user) => user.user_id === selectedUserId) ?? users[0] ?? null,
    [selectedUserId, users],
  );

  const value = useMemo(
    () => ({
      currentUser,
      error: error as Error | undefined,
      isLoading: loading,
      setCurrentUserId: (userId: string) => {
        setSelectedUserId(userId);
        window.localStorage.setItem(STORAGE_KEY, userId);
      },
      users,
    }),
    [currentUser, error, loading, users],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}
