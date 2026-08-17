import { FaChevronDown, FaGoogle, FaSignOutAlt, FaUser } from "react-icons/fa";
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
    <div className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl border-2 border-[#24211c] bg-[#fff4d6]/95 px-2.5 py-2 text-[#24211c] shadow-[0_3px_0_#24211c] backdrop-blur-sm">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#24211c] text-[#fff4d6]">
        <FaUser size={12} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        {isLoading ? (
          <span className="block px-1 text-sm font-semibold">Betöltés...</span>
        ) : authMode === "firebase" ? (
          <div className="flex items-center gap-2">
            {isAuthenticated && currentUser ? (
              <>
                <span className="max-w-36 truncate px-1 text-sm font-semibold sm:max-w-52">
                  {currentUser.display_name ||
                    currentUser.email ||
                    "Bejelentkezve"}
                </span>
                <button
                  onClick={() => void signOutCurrentUser()}
                  aria-label="Kijelentkezés"
                  title="Kijelentkezés"
                  className="grid size-7 shrink-0 place-items-center rounded-md border border-[#24211c] bg-[#ffd75a] transition-colors hover:bg-[#ffc928]"
                >
                  <FaSignOutAlt size={12} />
                </button>
              </>
            ) : (
              <button
                onClick={() => void signInWithGoogle()}
                className="inline-flex items-center gap-2 rounded-md px-1 text-sm font-semibold transition-colors hover:text-[#8a5200]"
              >
                <FaGoogle size={12} />
                Belépés Google-lel
              </button>
            )}
          </div>
        ) : (
          <label className="relative block">
            <span className="sr-only">Aktív felhasználó</span>
            <select
              aria-label="Aktív felhasználó"
              value={currentUser?.user_id ?? ""}
              onChange={(event) => setCurrentUserId(event.target.value)}
              className="block max-w-40 cursor-pointer appearance-none truncate bg-transparent py-0.5 pl-1 pr-7 text-sm font-semibold text-[#24211c] outline-none focus-visible:ring-2 focus-visible:ring-[#8a5200] sm:max-w-56"
            >
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.display_name || user.email || user.user_id}
                </option>
              ))}
            </select>
            <FaChevronDown
              size={10}
              aria-hidden="true"
              className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2"
            />
          </label>
        )}
      </div>
    </div>
  );
}
