import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Question } from "../models/Question";
import { useQuiz } from "../context/QuizContext.tsx";
import { cn } from "../utility/utils.ts";

type Category = {
  category: string;
  questions: Question[];
};

type Props = {
  data: Category[];
  onSelect: (catIndex: number, qIndex: number, double: boolean) => void;
  font?: string;
  questionPathPrefix?: string;
};

type QuestionContextMenu = {
  catIndex: number;
  qIndex: number;
  x: number;
  y: number;
};

export function Board({
  data,
  onSelect,
  font,
  questionPathPrefix = "/question",
}: Props) {
  const navigate = useNavigate();
  const { settings } = useQuiz();
  const { classicMode } = settings;
  const [contextMenu, setContextMenu] = useState<QuestionContextMenu | null>(
    null,
  );
  const boardRef = useRef<HTMLDivElement>(null);
  const contextMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) {
      return;
    }

    const handleContextMenu = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const questionButton = event.target.closest<HTMLButtonElement>(
        "button[data-question-tile]",
      );
      if (
        !questionButton ||
        !board.contains(questionButton) ||
        questionButton.dataset.used !== "true"
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const menuWidth = 236;
      const menuHeight = 52;
      setContextMenu({
        catIndex: Number(questionButton.dataset.catIndex),
        qIndex: Number(questionButton.dataset.qIndex),
        x: Math.max(
          8,
          Math.min(event.clientX, window.innerWidth - menuWidth - 8),
        ),
        y: Math.max(
          8,
          Math.min(event.clientY, window.innerHeight - menuHeight - 8),
        ),
      });
    };

    board.addEventListener("contextmenu", handleContextMenu, true);
    return () =>
      board.removeEventListener("contextmenu", handleContextMenu, true);
  }, []);

  useEffect(() => {
    if (!contextMenu) {
      return;
    }

    contextMenuButtonRef.current?.focus();
    const closeMenu = () => setContextMenu(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu]);

  return (
    <div
      ref={boardRef}
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="w-full max-w-screen-xl overflow-x-auto px-1 sm:px-4">
        <div
          className="grid gap-2 sm:gap-4"
          style={{
            gridTemplateColumns: `repeat(${data.length}, minmax(64px, 1fr))`,
          }}
        >
          {data.map((cat, colIndex) => {
            const firstUnansweredIndex = cat.questions.findIndex(
              (q) => !q.isUsed,
            );

            return (
              <div key={colIndex} className="flex flex-col items-center gap-2">
                <h2
                  className={cn(
                    "flex min-h-10 items-end break-all text-center text-[10px] font-bold leading-tight sm:min-h-0 sm:break-normal sm:text-2xl",
                    font,
                  )}
                >
                  {cat.category}
                </h2>
                {cat.questions.map((q, rowIndex) => {
                  const isClassicLocked =
                    !q.isUsed &&
                    classicMode &&
                    rowIndex !== firstUnansweredIndex;

                  return (
                    <button
                      key={`${colIndex}-${rowIndex}`}
                      data-question-tile
                      data-used={q.isUsed}
                      data-cat-index={colIndex}
                      data-q-index={rowIndex}
                      onClick={() => {
                        if (q.isUsed || isClassicLocked) {
                          return;
                        }

                        onSelect(colIndex, rowIndex, true);
                        setTimeout(
                          () =>
                            navigate(
                              `${questionPathPrefix}/${colIndex + 1}/${rowIndex + 1}`,
                            ),
                          0,
                        );
                      }}
                      disabled={isClassicLocked}
                      aria-disabled={isClassicLocked}
                      aria-pressed={q.isUsed}
                      aria-label={`${q.points} pont${
                        q.isUsed
                          ? ", felhasznált; jobb kattintással visszaállítható"
                          : ""
                      }`}
                      title={
                        q.isUsed
                          ? "Jobb kattintással újra elérhetővé tehető"
                          : undefined
                      }
                      className={`w-full rounded-lg border-2 p-2 text-sm font-bold transition-all duration-150 sm:rounded-xl sm:p-4 sm:text-lg ${
                        q.isUsed
                          ? "cursor-default border-[#1f4d2b] bg-[#86c98f] text-[#14351d] shadow-[0_3px_0_#1f4d2b]"
                          : isClassicLocked
                            ? "cursor-not-allowed border-[#777168] bg-[#d6d0c4] text-[#706a61] shadow-[0_3px_0_#777168]"
                            : "border-[#24211c] bg-[#fff4d6] text-[#24211c] shadow-[0_4px_0_#24211c] hover:-translate-y-0.5 hover:bg-[#ffd75a] hover:shadow-[0_6px_0_#24211c] active:translate-y-0 active:shadow-[0_2px_0_#24211c]"
                      }`}
                    >
                      {q.points}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {contextMenu ? (
        <div
          role="menu"
          aria-label="Kérdés műveletei"
          className="fixed z-50 min-w-56 rounded-lg border-2 border-[#24211c] bg-[#fff4d6] p-1.5 text-[#24211c] shadow-[0_5px_0_#24211c]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            ref={contextMenuButtonRef}
            role="menuitem"
            onClick={() => {
              onSelect(contextMenu.catIndex, contextMenu.qIndex, false);
              setContextMenu(null);
            }}
            className="w-full rounded-md px-3 py-2 text-left text-sm font-bold outline-none hover:bg-[#ffd75a] focus-visible:bg-[#ffd75a]"
          >
            Újra elérhetővé tétel
          </button>
        </div>
      ) : null}
    </div>
  );
}
