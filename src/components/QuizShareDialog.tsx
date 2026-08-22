import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { FaShareAlt, FaTimes, FaUserMinus } from "react-icons/fa";
import { toast } from "sonner";
import { api } from "../api/client";
import { useCurrentUser } from "../context/useCurrentUser";

export default function QuizShareDialog({
  onClose,
  quizId,
  quizTitle,
}: {
  onClose: () => void;
  quizId: string;
  quizTitle: string;
}) {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const sharesQuery = useQuery({
    queryFn: () => api.getQuizShares(quizId, currentUser?.user_id),
    queryKey: ["quiz-shares", quizId, currentUser?.user_id],
  });
  const createShare = useMutation({
    mutationFn: (recipientEmail: string) =>
      api.createQuizShare(quizId, recipientEmail, currentUser?.user_id),
    onSuccess: async () => {
      setEmail("");
      await queryClient.invalidateQueries({
        queryKey: ["quiz-shares", quizId],
      });
      toast.success("A kvíz megosztva.");
    },
  });
  const deleteShare = useMutation({
    mutationFn: (userId: string) =>
      api.deleteQuizShare(quizId, userId, currentUser?.user_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["quiz-shares", quizId],
      });
      toast.success("A hozzáférés visszavonva.");
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const recipientEmail = email.trim();
    if (!recipientEmail) return;

    try {
      await createShare.mutateAsync(recipientEmail);
    } catch (error) {
      const message =
        error instanceof Error && error.message === "User not found"
          ? "Nem található regisztrált felhasználó ezzel az e-mail-címmel."
          : error instanceof Error
            ? error.message
            : "A megosztás nem sikerült.";
      toast.error(message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="share-dialog-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl border-2 border-[#24211c] bg-[#fff8e7] p-6 text-[#24211c] shadow-[0_7px_0_#24211c]"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="share-dialog-title" className="font-display text-3xl">
              Kvíz megosztása
            </h2>
            <p className="mt-1 text-sm text-[#756b5c]">{quizTitle}</p>
          </div>
          <button
            aria-label="Bezárás"
            className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-[#24211c] bg-white hover:bg-[#ffd75a]"
            onClick={onClose}
            type="button"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">Címzett e-mail-címe</span>
            <input
              autoFocus
              className="w-full rounded-xl border-2 border-[#8c8374] bg-white px-4 py-3 outline-none focus:border-[#d48313] focus:ring-2 focus:ring-[#ffd75a]/60"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="felhasznalo@example.com"
              type="email"
              value={email}
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24211c] px-5 py-3 font-bold text-white hover:bg-[#3a352d] disabled:cursor-wait disabled:opacity-60"
            disabled={createShare.isPending || !email.trim()}
            type="submit"
          >
            <FaShareAlt aria-hidden="true" size={14} />
            Megosztás
          </button>
        </form>
        <p className="mt-2 text-xs text-[#756b5c]">
          A címzett megnyithatja és lejátszhatja a kvízt, de nem szerkesztheti.
        </p>

        <div className="mt-6 border-t border-[#c9bfae] pt-5">
          <h3 className="font-bold">Hozzáféréssel rendelkezők</h3>
          {sharesQuery.isPending ? (
            <p className="mt-3 text-sm text-[#756b5c]">Betöltés…</p>
          ) : sharesQuery.error ? (
            <p className="mt-3 text-sm text-[#a62f1f]" role="alert">
              {sharesQuery.error.message}
            </p>
          ) : !sharesQuery.data?.shares.length ? (
            <p className="mt-3 text-sm text-[#756b5c]">
              A kvíz még nincs megosztva senkivel.
            </p>
          ) : (
            <ul className="mt-3 grid gap-2">
              {sharesQuery.data.shares.map((share) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#c9bfae] bg-white px-4 py-3"
                  key={share.user.user_id}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {share.user.display_name || share.user.email}
                    </p>
                    {share.user.display_name && share.user.email ? (
                      <p className="truncate text-xs text-[#756b5c]">
                        {share.user.email}
                      </p>
                    ) : null}
                  </div>
                  <button
                    aria-label={`Hozzáférés visszavonása: ${share.user.display_name || share.user.email || share.user.user_id}`}
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#a62f1f] text-[#a62f1f] hover:bg-[#a62f1f] hover:text-white disabled:opacity-50"
                    disabled={deleteShare.isPending}
                    onClick={async () => {
                      try {
                        await deleteShare.mutateAsync(share.user.user_id);
                      } catch (error) {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "A hozzáférés visszavonása nem sikerült.",
                        );
                      }
                    }}
                    title="Hozzáférés visszavonása"
                    type="button"
                  >
                    <FaUserMinus aria-hidden="true" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
