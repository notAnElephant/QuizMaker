import { FaGoogle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useCurrentUser } from "../context/useCurrentUser";

export default function UserSwitcher() {
  const {
    authMode,
    currentUser,
    isAuthenticated,
    isLoading,
    setCurrentUserId,
    signInWithGoogle,
    signOutCurrentUser,
    users,
  } = useCurrentUser();

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/92 px-4 py-3 shadow">
      <FaUser className="text-gray-600" />
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Aktív felhasználó
        </span>
        {isLoading ? (
          <span className="text-sm text-gray-600">Betöltés...</span>
        ) : authMode === "firebase" ? (
          <div className="flex items-center gap-2">
            {isAuthenticated && currentUser ? (
              <>
                <span className="text-sm font-medium text-black">
                  {currentUser.display_name || currentUser.email || "Bejelentkezve"}
                </span>
                <button
                  onClick={() => void signOutCurrentUser()}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <FaSignOutAlt size={12} />
                  Kilépés
                </button>
              </>
            ) : (
              <button
                onClick={() => void signInWithGoogle()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <FaGoogle size={12} />
                Google login
              </button>
            )}
          </div>
        ) : (
          <select
            value={currentUser?.user_id ?? ""}
            onChange={(event) => setCurrentUserId(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black"
          >
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.display_name || user.email || user.user_id}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
