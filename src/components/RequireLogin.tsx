import type { ReactNode } from "react";
import { useCurrentUser } from "../context/useCurrentUser";
import UserSwitcher from "./UserSwitcher";

export default function RequireLogin({ children }: { children: ReactNode }) {
  const { error, isAuthenticated, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7efd9] p-6 text-[#24211c]">
        <p className="font-bold">Bejelentkezés ellenőrzése…</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7efd9] p-6 text-[#24211c]">
        <section className="w-full max-w-md rounded-2xl border-2 border-[#24211c] bg-[#fff8e7] p-8 text-center shadow-[0_6px_0_#24211c]">
          <h1 className="font-display text-3xl font-bold">
            Bejelentkezés szükséges
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#756b5c]">
            A kvízszerkesztő és a mentett kvízek csak bejelentkezés után érhetők
            el.
          </p>
          <div className="mt-6 flex justify-center">
            <UserSwitcher />
          </div>
          {error ? (
            <p className="mt-4 text-sm text-[#a62f1f]" role="alert">
              {error.message}
            </p>
          ) : null}
        </section>
      </main>
    );
  }

  return children;
}
