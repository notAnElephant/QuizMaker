import { useQuery } from "@tanstack/react-query";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { ApiUser } from "../api/types";
import {
  firebaseAuth,
  isFirebaseAuthEmulatorMode,
  googleAuthProvider,
  isFirebaseAuthEnabled,
} from "../firebase";
import { createStableUuid } from "../utility/stableUuid";
import { CurrentUserContext } from "./currentUserState";

const STORAGE_KEY = "quizmaker.currentUserId";

function mapFirebaseUser(user: FirebaseUser): ApiUser {
  return {
    display_name: user.displayName,
    email: user.email,
    user_id: createStableUuid(`firebase:${user.uid}`),
  };
}

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(STORAGE_KEY),
  );
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(!isFirebaseAuthEnabled);
  const [authError, setAuthError] = useState<Error | undefined>(undefined);
  const {
    data,
    error,
    isPending: isLoadingUsers,
  } = useQuery({
    enabled: !isFirebaseAuthEnabled,
    queryFn: api.getUsers,
    queryKey: ["users"],
  });

  const users = useMemo(() => data?.users ?? [], [data]);

  useEffect(() => {
    if (!isFirebaseAuthEnabled || !firebaseAuth) {
      return;
    }

    return onAuthStateChanged(firebaseAuth, async (user) => {
      try {
        if (user) {
          await api.syncCurrentUser({
            display_name: user.displayName,
            email: user.email,
          });
        }

        setFirebaseUser(user);
        setAuthError(undefined);
      } catch (mutationError) {
        setAuthError(
          mutationError instanceof Error
            ? mutationError
            : new Error(
                "Nem sikerült szinkronizálni a bejelentkezett felhasználót.",
              ),
        );
      } finally {
        setAuthReady(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isFirebaseAuthEnabled || !users.length) {
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

  const currentUser = useMemo(() => {
    if (isFirebaseAuthEnabled) {
      return firebaseUser ? mapFirebaseUser(firebaseUser) : null;
    }

    return (
      users.find((user) => user.user_id === selectedUserId) ?? users[0] ?? null
    );
  }, [firebaseUser, selectedUserId, users]);
  const authMode: "firebase" | "local" = isFirebaseAuthEnabled
    ? "firebase"
    : "local";

  const value = useMemo(
    () => ({
      authMode,
      currentUser,
      error: (authError ?? error) as Error | undefined,
      isAuthenticated: !!currentUser,
      isLoading: isFirebaseAuthEnabled ? !authReady : isLoadingUsers,
      setCurrentUserId: (userId: string) => {
        if (isFirebaseAuthEnabled) {
          return;
        }

        setSelectedUserId(userId);
        window.localStorage.setItem(STORAGE_KEY, userId);
      },
      signInWithGoogle: async () => {
        if (!firebaseAuth || !googleAuthProvider) {
          throw new Error("A Google bejelentkezés nincs konfigurálva.");
        }

        if (isFirebaseAuthEmulatorMode) {
          await signInWithRedirect(firebaseAuth, googleAuthProvider);
          return;
        }

        await signInWithPopup(firebaseAuth, googleAuthProvider);
      },
      signOutCurrentUser: async () => {
        if (isFirebaseAuthEnabled && firebaseAuth) {
          await signOut(firebaseAuth);
          return;
        }

        setSelectedUserId(users[0]?.user_id ?? null);
      },
      users: isFirebaseAuthEnabled ? (currentUser ? [currentUser] : []) : users,
    }),
    [authError, authMode, authReady, currentUser, error, isLoadingUsers, users],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}
