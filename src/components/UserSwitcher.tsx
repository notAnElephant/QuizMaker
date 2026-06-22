import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "../context/useCurrentUser";

export default function UserSwitcher() {
  const { currentUser, isLoading, setCurrentUserId, users } = useCurrentUser();

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/92 px-4 py-3 shadow">
      <FaUser className="text-gray-600" />
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Aktív felhasználó
        </span>
        {isLoading ? (
          <span className="text-sm text-gray-600">Betöltés...</span>
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
