import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { FaEnvelope, FaShareAlt, FaTimes, FaUserMinus } from "react-icons/fa";
import { toast } from "sonner";
import { api } from "../api/client";
import type { QuizShareRole } from "../api/types";
import { useCurrentUser } from "../context/useCurrentUser";

const ROLE_DESCRIPTIONS: Record<QuizShareRole, string> = {
  EDITOR: "Megnyithatja, lejátszhatja és szerkesztheti a kvízt.",
  VIEWER: "Megnyithatja és lejátszhatja a kvízt, de nem szerkesztheti.",
};

function RoleSelect({
  ariaLabel,
  disabled,
  onChange,
  value,
}: {
  ariaLabel: string;
  disabled?: boolean;
  onChange: (role: QuizShareRole) => void;
  value: QuizShareRole;
}) {
  return (
    <select
      aria-label={ariaLabel}
      className="shrink-0 rounded-lg border border-[#8c8374] bg-white px-2 py-1.5 text-sm font-semibold outline-none focus:border-[#d48313] focus:ring-2 focus:ring-[#ffd75a]/60 disabled:opacity-50"
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as QuizShareRole)}
      value={value}
    >
      <option value="VIEWER">Megtekintő</option>
      <option value="EDITOR">Szerkesztő</option>
    </select>
  );
}

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
  const [role, setRole] = useState<QuizShareRole>("VIEWER");
  const queryKey = ["quiz-shares", quizId, currentUser?.user_id];
  const invalidateShares = () =>
    queryClient.invalidateQueries({ queryKey: ["quiz-shares", quizId] });
  const sharesQuery = useQuery({
    queryFn: () => api.getQuizShares(quizId, currentUser?.user_id),
    queryKey,
  });
  const createShare = useMutation({
    mutationFn: ({
      recipientEmail,
      recipientRole,
    }: {
      recipientEmail: string;
      recipientRole: QuizShareRole;
    }) =>
      api.createQuizShare(
        quizId,
        recipientEmail,
        recipientRole,
        currentUser?.user_id,
      ),
    onSuccess: async (result) => {
      setEmail("");
      await invalidateShares();
      if (result.outcome === "SHARED") toast.success("A kvíz megosztva.");
      else if (result.outcome === "INVITED")
        toast.success("A meghívó e-mail elküldve.");
      else toast.warning("A meghívó létrejött, de az e-mail nem küldhető el.");
    },
  });
  const deleteShare = useMutation({
    mutationFn: (userId: string) =>
      api.deleteQuizShare(quizId, userId, currentUser?.user_id),
    onSuccess: async () => {
      await invalidateShares();
      toast.success("A hozzáférés visszavonva.");
    },
  });
  const deleteInvitation = useMutation({
    mutationFn: (invitationId: string) =>
      api.deleteQuizInvitation(quizId, invitationId, currentUser?.user_id),
    onSuccess: async () => {
      await invalidateShares();
      toast.success("A meghívó visszavonva.");
    },
  });
  const updateShareRole = useMutation({
    mutationFn: ({
      userId,
      nextRole,
    }: {
      userId: string;
      nextRole: QuizShareRole;
    }) =>
      api.updateQuizShareRole(quizId, userId, nextRole, currentUser?.user_id),
    onSuccess: async () => {
      await invalidateShares();
      toast.success("A hozzáférési szint frissítve.");
    },
  });
  const updateInvitationRole = useMutation({
    mutationFn: ({
      invitationId,
      nextRole,
    }: {
      invitationId: string;
      nextRole: QuizShareRole;
    }) =>
      api.updateQuizInvitationRole(
        quizId,
        invitationId,
        nextRole,
        currentUser?.user_id,
      ),
    onSuccess: async () => {
      await invalidateShares();
      toast.success("A meghívó hozzáférési szintje frissítve.");
    },
  });
  const resendInvitation = useMutation({
    mutationFn: (invitationId: string) =>
      api.resendQuizInvitation(quizId, invitationId, currentUser?.user_id),
    onSuccess: async () => {
      await invalidateShares();
      toast.success("A meghívó e-mail újra elküldve.");
    },
  });

  const showMutationError = (error: unknown, fallback: string) =>
    toast.error(error instanceof Error ? error.message : fallback);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const recipientEmail = email.trim();
    if (!recipientEmail) return;

    try {
      await createShare.mutateAsync({ recipientEmail, recipientRole: role });
    } catch (error) {
      showMutationError(error, "A megosztás nem sikerült.");
    }
  };
  const isUpdating =
    updateShareRole.isPending || updateInvitationRole.isPending;

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
        className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-[#24211c] bg-[#fff8e7] p-6 text-[#24211c] shadow-[0_7px_0_#24211c]"
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
          className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]"
          onSubmit={handleSubmit}
        >
          <label className="min-w-0 sm:col-span-2">
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
          <div>
            <RoleSelect
              ariaLabel="Új címzett hozzáférési szintje"
              onChange={setRole}
              value={role}
            />
            <p className="mt-1 text-xs text-[#756b5c]">
              {ROLE_DESCRIPTIONS[role]}
            </p>
          </div>
          <button
            className="inline-flex h-fit items-center justify-center gap-2 rounded-xl bg-[#24211c] px-5 py-3 font-bold text-white hover:bg-[#3a352d] disabled:cursor-wait disabled:opacity-60"
            disabled={createShare.isPending || !email.trim()}
            type="submit"
          >
            <FaShareAlt aria-hidden="true" size={14} />
            Megosztás
          </button>
        </form>

        <div className="mt-6 border-t border-[#c9bfae] pt-5">
          <h3 className="font-bold">Hozzáféréssel rendelkezők</h3>
          {sharesQuery.isPending ? (
            <p className="mt-3 text-sm text-[#756b5c]">Betöltés…</p>
          ) : sharesQuery.error ? (
            <p className="mt-3 text-sm text-[#a62f1f]" role="alert">
              {sharesQuery.error.message}
            </p>
          ) : !sharesQuery.data?.shares.length &&
            !sharesQuery.data?.invitations.length ? (
            <p className="mt-3 text-sm text-[#756b5c]">
              A kvíz még nincs megosztva senkivel.
            </p>
          ) : (
            <ul className="mt-3 grid gap-2">
              {sharesQuery.data?.shares.map((share) => (
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
                  <div className="flex shrink-0 items-center gap-2">
                    <RoleSelect
                      ariaLabel={`Hozzáférési szint: ${share.user.display_name || share.user.email || share.user.user_id}`}
                      disabled={isUpdating}
                      onChange={(nextRole) => {
                        void updateShareRole
                          .mutateAsync({ nextRole, userId: share.user.user_id })
                          .catch((error: unknown) =>
                            showMutationError(
                              error,
                              "A hozzáférési szint nem frissíthető.",
                            ),
                          );
                      }}
                      value={share.role}
                    />
                    <button
                      aria-label={`Hozzáférés visszavonása: ${share.user.display_name || share.user.email || share.user.user_id}`}
                      className="grid size-9 place-items-center rounded-lg border border-[#a62f1f] text-[#a62f1f] hover:bg-[#a62f1f] hover:text-white disabled:opacity-50"
                      disabled={deleteShare.isPending}
                      onClick={() => {
                        void deleteShare
                          .mutateAsync(share.user.user_id)
                          .catch((error: unknown) =>
                            showMutationError(
                              error,
                              "A hozzáférés visszavonása nem sikerült.",
                            ),
                          );
                      }}
                      title="Hozzáférés visszavonása"
                      type="button"
                    >
                      <FaUserMinus aria-hidden="true" size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {sharesQuery.data?.invitations.map((invitation) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-[#c9bfae] bg-[#fff4d6] px-4 py-3"
                  key={invitation.invitation_id}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{invitation.email}</p>
                    <p className="text-xs text-[#756b5c]">
                      {invitation.delivery_status === "SENT"
                        ? "Meghívó elküldve"
                        : invitation.delivery_status === "FAILED"
                          ? "Az e-mail kézbesítése sikertelen"
                          : "Meghívó küldése folyamatban"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <RoleSelect
                      ariaLabel={`Meghívó hozzáférési szintje: ${invitation.email}`}
                      disabled={isUpdating}
                      onChange={(nextRole) => {
                        void updateInvitationRole
                          .mutateAsync({
                            invitationId: invitation.invitation_id,
                            nextRole,
                          })
                          .catch((error: unknown) =>
                            showMutationError(
                              error,
                              "A meghívó hozzáférési szintje nem frissíthető.",
                            ),
                          );
                      }}
                      value={invitation.role}
                    />
                    {invitation.delivery_status !== "SENT" ? (
                      <button
                        aria-label={`Meghívó újraküldése: ${invitation.email}`}
                        className="grid size-9 place-items-center rounded-lg border border-[#d48313] text-[#8a5200] hover:bg-[#ffd75a] disabled:opacity-50"
                        disabled={resendInvitation.isPending}
                        onClick={() => {
                          void resendInvitation
                            .mutateAsync(invitation.invitation_id)
                            .catch((error: unknown) =>
                              showMutationError(
                                error,
                                "A meghívó újraküldése nem sikerült.",
                              ),
                            );
                        }}
                        title="Meghívó újraküldése"
                        type="button"
                      >
                        <FaEnvelope aria-hidden="true" size={14} />
                      </button>
                    ) : null}
                    <button
                      aria-label={`Meghívó visszavonása: ${invitation.email}`}
                      className="grid size-9 place-items-center rounded-lg border border-[#a62f1f] text-[#a62f1f] hover:bg-[#a62f1f] hover:text-white disabled:opacity-50"
                      disabled={deleteInvitation.isPending}
                      onClick={() => {
                        void deleteInvitation
                          .mutateAsync(invitation.invitation_id)
                          .catch((error: unknown) =>
                            showMutationError(
                              error,
                              "A meghívó visszavonása nem sikerült.",
                            ),
                          );
                      }}
                      title="Meghívó visszavonása"
                      type="button"
                    >
                      <FaUserMinus aria-hidden="true" size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
