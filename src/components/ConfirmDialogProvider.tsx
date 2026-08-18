import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ConfirmContext,
  type ConfirmContextValue,
  type ConfirmOptions,
} from "../context/confirmDialogState";

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  const finish = useCallback((confirmed: boolean) => {
    resolverRef.current?.(confirmed);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback<ConfirmContextValue>((nextOptions) => {
    resolverRef.current?.(false);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(nextOptions);
    });
  }, []);

  useEffect(
    () => () => {
      resolverRef.current?.(false);
    },
    [],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog.Root
        open={options !== null}
        onOpenChange={(open) => {
          if (!open) finish(false);
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-[100] bg-[#24211c]/65 backdrop-blur-sm" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#24211c] bg-[#fff8e7] p-6 text-[#24211c] shadow-[0_7px_0_#24211c] focus:outline-none sm:p-7">
            <AlertDialog.Title className="font-display text-2xl font-bold">
              {options?.title ?? "Biztosan folytatod?"}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#756b5c]">
              {options?.description}
            </AlertDialog.Description>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AlertDialog.Cancel asChild>
                <button
                  type="button"
                  onClick={() => finish(false)}
                  className="rounded-xl border-2 border-[#8c8374] bg-[#fffdf7] px-4 py-2.5 text-sm font-bold transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd75a]/70"
                >
                  {options?.cancelLabel ?? "Mégse"}
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  type="button"
                  onClick={() => finish(true)}
                  className={`rounded-xl border-2 border-[#24211c] px-4 py-2.5 text-sm font-bold shadow-[0_3px_0_#24211c] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd75a]/70 ${
                    options?.destructive
                      ? "bg-[#d5572a] text-white"
                      : "bg-[#ffd75a] text-[#24211c]"
                  }`}
                >
                  {options?.confirmLabel ?? "Folytatás"}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext.Provider>
  );
}
