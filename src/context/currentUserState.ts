import { createContext } from "react";

type CurrentUser = {
  display_name?: string | null;
  email?: string | null;
  user_id: string;
};

export type CurrentUserContextValue = {
  currentUser: CurrentUser | null;
  error?: Error;
  isLoading: boolean;
  setCurrentUserId: (userId: string) => void;
  users: CurrentUser[];
};

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(
  null,
);
