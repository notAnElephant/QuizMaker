import { createContext } from "react";

type CurrentUser = {
  display_name?: string | null;
  email?: string | null;
  user_id: string;
};

export type CurrentUserContextValue = {
  authMode: "firebase" | "local";
  currentUser: CurrentUser | null;
  error?: Error;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutCurrentUser: () => Promise<void>;
  setCurrentUserId: (userId: string) => void;
  users: CurrentUser[];
};

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(
  null,
);
