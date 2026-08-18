import { DragEvent, useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCheck,
  FaEye,
  FaFileImport,
  FaFolderOpen,
  FaGripVertical,
  FaImage,
  FaMagic,
  FaPlay,
  FaPlus,
  FaSave,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { QuizAppearance } from "../context/types";
import { useCurrentUser } from "../context/useCurrentUser";
import { useQuizPersistence } from "../hooks/useQuizPersistence";
import {
  backgroundPresets,
  getSuggestedTextColor,
  suggestTextColorForImage,
} from "../utility/quizAppearance";
import { parseQuestionsJson } from "../utility/questionsImport";
import { uploadQuizImage } from "../utility/quizMediaStorage";
import UserSwitcher from "./UserSwitcher";

type DraggedQuestion = {
  sourceCatIndex: number;
  sourceQuestionIndex: number;
};

const fieldClass =
  "w-full rounded-lg border border-[#8c8374] bg-[#fffdf7] px-3 py-2 text-sm text-[#24211c] outline-none transition focus:border-[#d48313] focus:ring-2 focus:ring-[#ffd75a]/60";

export default function Editor() {
  const navigate = useNavigate();
  const {
    addCategory,
    addQuestionToCategory,
    appearance,
    categories,
    createQuiz,
    currentQuizDescription,
    currentQuizTitle,
    describeQuiz,
    importCategories,
    moveQuestion,
    removeCategory,
    removeQuestion,
    renameCategory,
    renameQuiz,
    setAppearance,
    updateQuestion,
    updateQuestionPoints,
  } = useQuiz();
  const { currentUser } = useCurrentUser();
  const { isSaving, persistQuiz } = useQuizPersistence();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [draggedQuestion, setDraggedQuestion] =
    useState<DraggedQuestion | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [mediaMessage, setMediaMessage] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState<
    "answer" | "background" | "question" | null
  >(null);
  const [textColorDraft, setTextColorDraft] = useState(appearance.textColor);

  const activeCategory = categories[selectedCategory];
  const activeQuestion = activeCategory?.questions[selectedQuestion];
  const questionCount = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + category.questions.length,
        0,
      ),
    [categories],
  );

  useEffect(() => {
    if (selectedCategory >= categories.length) {
      setSelectedCategory(Math.max(0, categories.length - 1));
      setSelectedQuestion(0);
    } else if (
      selectedQuestion >= (categories[selectedCategory]?.questions.length ?? 0)
    ) {
      setSelectedQuestion(
        Math.max(0, (categories[selectedCategory]?.questions.length ?? 1) - 1),
      );
    }
  }, [categories, selectedCategory, selectedQuestion]);

  useEffect(() => {
    setTextColorDraft(appearance.textColor);
  }, [appearance.textColor]);

  const saveQuiz = async () => {
    setSaveMessage("");
    try {
      const result = await persistQuiz();
      setSaveMessage(
        result.wasUpdate ? "Módosítások elmentve" : "Kvíz létrehozva",
      );
      return true;
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : "A mentés nem sikerült.",
      );
      return false;
    }
  };

  const handleBackgroundUpload = async (file?: File) => {
    if (!file) return;
    setMediaMessage("");
    setUploadingMedia("background");
    try {
      const imageUrl = await uploadQuizImage(file);
      const textColor = await suggestTextColorForImage(imageUrl);
      setAppearance((current) => ({
        ...current,
        backgroundImage: imageUrl,
        backgroundMode: "image",
        textColor,
      }));
      setMediaMessage("A háttérkép feltöltve.");
    } catch (error) {
      setMediaMessage(
        error instanceof Error ? error.message : "A feltöltés nem sikerült.",
      );
    } finally {
      setUploadingMedia(null);
    }
  };

  const applySuggestedTextColor = async () => {
    const textColor =
      appearance.backgroundMode === "image" && appearance.backgroundImage
        ? await suggestTextColorForImage(appearance.backgroundImage)
        : getSuggestedTextColor(appearance);
    setAppearance((current) => ({ ...current, textColor }));
  };

  const selectPreset = (preset: QuizAppearance["backgroundPreset"]) => {
    setAppearance((current) => ({
      ...current,
      backgroundMode: "preset",
      backgroundPreset: preset,
      textColor: backgroundPresets[preset].suggestedTextColor,
    }));
  };

  const handleQuestionImageUpload = async (file?: File) => {
    if (!file || !activeQuestion) return;
    setMediaMessage("");
    setUploadingMedia("question");
    try {
      const imageUrl = await uploadQuizImage(file);
      updateQuestion(selectedCategory, selectedQuestion, {
        source: imageUrl,
        type: "image",
      });
      setMediaMessage("A kérdés képe feltöltve.");
    } catch (error) {
      setMediaMessage(
        error instanceof Error ? error.message : "A feltöltés nem sikerült.",
      );
    } finally {
      setUploadingMedia(null);
    }
  };

  const handleAnswerImageUpload = async (file?: File) => {
    if (!file || !activeQuestion) return;
    setMediaMessage("");
    setUploadingMedia("answer");
    try {
      const imageUrl = await uploadQuizImage(file);
      updateQuestion(selectedCategory, selectedQuestion, {
        answerMediaType: "image",
        answerSource: imageUrl,
      });
      setMediaMessage("A válasz képe feltöltve.");
    } catch (error) {
      setMediaMessage(
        error instanceof Error ? error.message : "A feltöltés nem sikerült.",
      );
    } finally {
      setUploadingMedia(null);
    }
  };

  const handleQuestionsImport = async (file?: File) => {
    if (!file) return;
    setImportMessage("");

    try {
      const nextCategories = parseQuestionsJson(await file.text());
      if (
        !window.confirm(
          `A fájl ${nextCategories.length} kategóriát tartalmaz. Lecseréled a szerkesztő jelenlegi kérdéseit?`,
        )
      ) {
        return;
      }

      importCategories(nextCategories);
      setSelectedCategory(0);
      setSelectedQuestion(0);
      setSaveMessage("");
      setImportMessage(
        `${file.name} importálva (${nextCategories.length} kategória).`,
      );
    } catch (error) {
      setImportMessage(
        error instanceof Error ? error.message : "Az importálás nem sikerült.",
      );
    }
  };

  const handleDrop = (targetCatIndex: number, targetQuestionIndex: number) => {
    if (!draggedQuestion) return;
    moveQuestion(
      draggedQuestion.sourceCatIndex,
      draggedQuestion.sourceQuestionIndex,
      targetCatIndex,
      targetQuestionIndex,
    );
    setSelectedCategory(targetCatIndex);
    setSelectedQuestion(targetQuestionIndex);
    setDraggedQuestion(null);
  };

  return (
    <main className="min-h-screen bg-[#f7efd9] text-[#24211c]">
      <header className="sticky top-0 z-40 border-b-2 border-[#24211c] bg-[#24211c] px-4 py-3 text-[#fff8e7] shadow-lg sm:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-4">
            <strong className="font-display text-3xl sm:text-4xl">
              Vágó Pesta
            </strong>
            <span className="hidden border-l border-white/25 pl-4 text-lg font-bold text-[#ffd75a] sm:block">
              Kvíz szerkesztő
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {saveMessage ? (
              <span
                aria-live="polite"
                className="mr-1 inline-flex items-center gap-2 text-sm text-[#b8db92]"
              >
                <FaCheck aria-hidden="true" />
                {saveMessage}
              </span>
            ) : null}
            <UserSwitcher />
            <button
              onClick={() => void saveQuiz()}
              disabled={isSaving || !currentUser}
              className="editor-button editor-button-dark"
            >
              {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Mentés
            </button>
            <button
              onClick={() => navigate("/preview")}
              className="editor-button editor-button-light"
            >
              <FaEye />
              Előnézet
            </button>
            <button
              onClick={async () => {
                if (await saveQuiz()) navigate("/");
              }}
              disabled={isSaving || !currentUser}
              className="editor-button editor-button-primary"
            >
              <FaPlay size={13} />
              Játék indítása
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <aside className="border-b border-[#cfc2aa] p-5 lg:min-h-[calc(100vh-74px)] lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black">Kategóriák</h2>
            <button
              onClick={() => {
                addCategory();
                setSelectedCategory(categories.length);
                setSelectedQuestion(0);
              }}
              className="grid size-8 place-items-center rounded-full border-2 border-[#d5572a] text-[#d5572a] hover:bg-[#d5572a] hover:text-white"
              aria-label="Új kategória"
              title="Új kategória"
            >
              <FaPlus size={13} />
            </button>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {categories.map((category, catIndex) => (
              <button
                key={`${catIndex}-${category.category}`}
                onClick={() => {
                  setSelectedCategory(catIndex);
                  setSelectedQuestion(0);
                }}
                className={`flex min-w-48 items-center justify-between gap-3 rounded-lg border-l-4 px-3 py-3 text-left text-sm transition lg:min-w-0 ${
                  catIndex === selectedCategory
                    ? "border-[#e0a20c] bg-[#fff8e7] shadow-sm"
                    : "border-transparent hover:bg-white/55"
                }`}
              >
                <span className="min-w-0 truncate font-bold">
                  {category.category || "Névtelen kategória"}
                </span>
                <span className="text-xs text-[#756b5c]">
                  {category.questions.length}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-6 grid gap-2 border-t border-[#cfc2aa] pt-5">
            <label className="editor-secondary-action cursor-pointer">
              <FaFileImport /> JSON importálása
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(event) => {
                  void handleQuestionsImport(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            {importMessage ? (
              <p className="px-3 text-xs text-[#756b5c]" aria-live="polite">
                {importMessage}
              </p>
            ) : null}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Új kvízt kezdesz. A nem mentett módosítások elvesznek. Folytatod?",
                  )
                ) {
                  createQuiz("Új kvíz", ["Új kategória"], 1);
                  setSelectedCategory(0);
                  setSelectedQuestion(0);
                  setSaveMessage("");
                }
              }}
              className="editor-secondary-action"
            >
              <FaPlus /> Új kvíz
            </button>
            <button
              onClick={() => navigate("/quizzes")}
              className="editor-secondary-action"
            >
              <FaFolderOpen /> Mentett kvízek
            </button>
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-[#cfc2aa] pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black sm:text-3xl">Kérdések</h1>
                <p className="mt-1 text-sm text-[#756b5c]">
                  {categories.length} kategória · {questionCount} kérdés
                </p>
              </div>
              {activeCategory ? (
                <button
                  onClick={() => {
                    addQuestionToCategory(selectedCategory);
                    setSelectedQuestion(activeCategory.questions.length);
                  }}
                  className="inline-flex items-center gap-2 font-bold text-[#d5572a]"
                >
                  <FaPlus /> Új kérdés
                </button>
              ) : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="editor-field-label">
                Kvíz címe
                <input
                  value={currentQuizTitle}
                  onChange={(event) => renameQuiz(event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="editor-field-label">
                Leírás
                <textarea
                  value={currentQuizDescription}
                  onChange={(event) => describeQuiz(event.target.value)}
                  rows={2}
                  className={fieldClass}
                />
              </label>
            </div>
          </div>

          {activeCategory ? (
            <div>
              <div className="mb-4 flex flex-wrap items-end gap-3">
                <label className="editor-field-label min-w-60 flex-1">
                  Kategória neve
                  <input
                    value={activeCategory.category}
                    onChange={(event) =>
                      renameCategory(selectedCategory, event.target.value)
                    }
                    className={fieldClass}
                  />
                </label>
                <button
                  onClick={() => {
                    if (window.confirm("Biztosan törlöd ezt a kategóriát?")) {
                      removeCategory(selectedCategory);
                    }
                  }}
                  className="editor-danger-button"
                >
                  <FaTrash /> Kategória törlése
                </button>
              </div>

              <div className="grid gap-2">
                {activeCategory.questions.map((question, qIndex) => {
                  const isSelected = selectedQuestion === qIndex;
                  return (
                    <article
                      key={`${selectedCategory}-${qIndex}`}
                      draggable
                      onDragStart={(event: DragEvent<HTMLElement>) => {
                        event.dataTransfer.effectAllowed = "move";
                        setDraggedQuestion({
                          sourceCatIndex: selectedCategory,
                          sourceQuestionIndex: qIndex,
                        });
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        handleDrop(selectedCategory, qIndex);
                      }}
                      className={`overflow-hidden rounded-lg border transition ${
                        isSelected
                          ? "border-[#e0a20c] bg-[#fffaf0] shadow-[0_3px_0_#e0a20c]"
                          : "border-[#cfc2aa] bg-white/45 hover:bg-white/75"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedQuestion(qIndex)}
                        className="grid w-full grid-cols-[20px_38px_minmax(0,1fr)_76px_26px] items-center gap-2 px-3 py-3 text-left"
                      >
                        <FaGripVertical className="text-[#877b68]" />
                        <strong>{qIndex + 1}</strong>
                        <span className="truncate text-sm font-semibold">
                          {question.content || "Üres kérdés"}
                        </span>
                        <span className="text-right text-xs font-bold">
                          {question.points} p
                        </span>
                        <FaArrowRight
                          className={`transition ${isSelected ? "rotate-90" : ""}`}
                        />
                      </button>

                      {isSelected ? (
                        <div className="border-t border-[#e7d7b7] p-4 sm:p-5">
                          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px_170px]">
                            <label className="editor-field-label">
                              Kérdés
                              <textarea
                                value={question.content}
                                onChange={(event) =>
                                  updateQuestion(selectedCategory, qIndex, {
                                    content: event.target.value,
                                  })
                                }
                                rows={3}
                                className={fieldClass}
                              />
                            </label>
                            <label className="editor-field-label">
                              Pontszám
                              <input
                                type="number"
                                min={0}
                                step={100}
                                value={question.points}
                                onChange={(event) =>
                                  updateQuestionPoints(
                                    selectedCategory,
                                    qIndex,
                                    Number(event.target.value) || 0,
                                  )
                                }
                                className={fieldClass}
                              />
                            </label>
                            <label className="editor-field-label">
                              Kérdés típusa
                              <select
                                value={question.type}
                                onChange={(event) =>
                                  updateQuestion(selectedCategory, qIndex, {
                                    type: event.target
                                      .value as typeof question.type,
                                  })
                                }
                                className={fieldClass}
                              >
                                <option value="text">Szöveg</option>
                                <option value="image">Kép</option>
                                <option value="video">Videó</option>
                                <option value="audio">Hang</option>
                              </select>
                            </label>
                          </div>

                          <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            <div className="grid content-start gap-4">
                              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#cfc2aa] bg-[#fff8e7] p-4">
                                <input
                                  type="checkbox"
                                  checked={question.revealAnswer}
                                  onChange={(event) =>
                                    updateQuestion(selectedCategory, qIndex, {
                                      revealAnswer: event.target.checked,
                                    })
                                  }
                                  className="mt-0.5 size-4 accent-[#d48313]"
                                />
                                <span>
                                  <strong className="block text-sm">
                                    Válasz megjelenítése a játékban
                                  </strong>
                                  <span className="mt-1 block text-xs text-[#756b5c]">
                                    A játékosok egy kártyafordítással fedhetik
                                    fel a választ.
                                  </span>
                                </span>
                              </label>
                              <label className="editor-field-label">
                                Válasz szövege
                                <textarea
                                  value={question.correctAnswer ?? ""}
                                  onChange={(event) =>
                                    updateQuestion(selectedCategory, qIndex, {
                                      correctAnswer: event.target.value,
                                    })
                                  }
                                  className={fieldClass}
                                  placeholder="A helyes válasz"
                                  rows={3}
                                />
                              </label>
                              <label className="editor-field-label">
                                Válaszlehetőségek
                                <textarea
                                  value={question.list?.join("\n") ?? ""}
                                  onChange={(event) =>
                                    updateQuestion(selectedCategory, qIndex, {
                                      list: event.target.value
                                        .split("\n")
                                        .map((item) => item.trim())
                                        .filter(Boolean),
                                    })
                                  }
                                  rows={5}
                                  className={fieldClass}
                                  placeholder="Egy lehetőség soronként"
                                />
                              </label>
                            </div>

                            <div>
                              <span className="editor-field-label">
                                Kép vagy média
                              </span>
                              {question.source ? (
                                <div className="relative mt-1 overflow-hidden rounded-xl border border-[#8c8374] bg-[#e9dfca]">
                                  {question.type === "image" ? (
                                    <img
                                      src={question.source}
                                      alt="Kérdés képe"
                                      className="h-44 w-full object-contain"
                                    />
                                  ) : (
                                    <div className="grid h-28 place-items-center px-4 text-center text-sm">
                                      {question.source}
                                    </div>
                                  )}
                                  <button
                                    onClick={() =>
                                      updateQuestion(selectedCategory, qIndex, {
                                        source: "",
                                      })
                                    }
                                    className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-[#24211c] text-white"
                                    aria-label="Média eltávolítása"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              ) : null}
                              <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#aa9d86] bg-white/40 px-4 py-5 text-sm font-bold hover:bg-white/75">
                                {uploadingMedia === "question" ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaImage />
                                )}
                                {uploadingMedia === "question"
                                  ? "Feltöltés…"
                                  : "Kép hozzáadása"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingMedia !== null}
                                  className="sr-only"
                                  onChange={(event) => {
                                    void handleQuestionImageUpload(
                                      event.target.files?.[0],
                                    );
                                    event.target.value = "";
                                  }}
                                />
                              </label>
                              <label className="editor-field-label mt-3">
                                Média URL
                                <input
                                  value={question.source ?? ""}
                                  onChange={(event) =>
                                    updateQuestion(selectedCategory, qIndex, {
                                      source: event.target.value,
                                    })
                                  }
                                  className={fieldClass}
                                  placeholder="https://…"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="mt-4 rounded-xl border border-[#cfc2aa] bg-white/35 p-4">
                            <div className="grid gap-4 lg:grid-cols-[170px_minmax(0,1fr)]">
                              <label className="editor-field-label">
                                Válasz médiatípusa
                                <select
                                  value={question.answerMediaType ?? "image"}
                                  onChange={(event) =>
                                    updateQuestion(selectedCategory, qIndex, {
                                      answerMediaType: event.target.value as
                                        | "image"
                                        | "video"
                                        | "audio",
                                    })
                                  }
                                  className={fieldClass}
                                >
                                  <option value="image">Kép</option>
                                  <option value="video">Videó</option>
                                  <option value="audio">Hang</option>
                                </select>
                              </label>
                              <label className="editor-field-label">
                                Válasz média URL
                                <input
                                  value={question.answerSource ?? ""}
                                  onChange={(event) =>
                                    updateQuestion(selectedCategory, qIndex, {
                                      answerSource: event.target.value,
                                    })
                                  }
                                  className={fieldClass}
                                  placeholder="https://…"
                                />
                              </label>
                            </div>
                            {question.answerSource ? (
                              <div className="relative mt-3 overflow-hidden rounded-xl border border-[#8c8374] bg-[#e9dfca]">
                                {question.answerMediaType === "image" ||
                                !question.answerMediaType ? (
                                  <img
                                    src={question.answerSource}
                                    alt="Válasz képe"
                                    className="h-44 w-full object-contain"
                                  />
                                ) : (
                                  <div className="grid min-h-24 place-items-center break-all px-12 py-4 text-center text-sm">
                                    {question.answerSource}
                                  </div>
                                )}
                                <button
                                  onClick={() =>
                                    updateQuestion(selectedCategory, qIndex, {
                                      answerSource: "",
                                    })
                                  }
                                  className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-[#24211c] text-white"
                                  aria-label="Válasz médiájának eltávolítása"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            ) : null}
                            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#aa9d86] bg-white/40 px-4 py-4 text-sm font-bold hover:bg-white/75">
                              {uploadingMedia === "answer" ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaImage />
                              )}
                              {uploadingMedia === "answer"
                                ? "Feltöltés…"
                                : "Válaszkép feltöltése"}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingMedia !== null}
                                className="sr-only"
                                onChange={(event) => {
                                  void handleAnswerImageUpload(
                                    event.target.files?.[0],
                                  );
                                  event.target.value = "";
                                }}
                              />
                            </label>
                          </div>

                          <div className="mt-5 flex justify-end">
                            <button
                              onClick={() => {
                                if (window.confirm("Törlöd ezt a kérdést?")) {
                                  removeQuestion(selectedCategory, qIndex);
                                }
                              }}
                              className="editor-danger-button"
                            >
                              <FaTrash /> Kérdés törlése
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
                <button
                  onClick={() => {
                    addQuestionToCategory(selectedCategory);
                    setSelectedQuestion(activeCategory.questions.length);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleDrop(
                      selectedCategory,
                      activeCategory.questions.length,
                    );
                  }}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#aa9d86] px-4 py-4 font-bold text-[#d5572a] hover:bg-white/50"
                >
                  <FaPlus /> Új kérdés
                </button>
              </div>
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center border-2 border-dashed border-[#aa9d86] text-center">
              <div>
                <p className="font-bold">Még nincs kategória.</p>
                <button
                  onClick={addCategory}
                  className="mt-3 text-[#d5572a] underline"
                >
                  Első kategória hozzáadása
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="border-t border-[#cfc2aa] p-5 lg:min-h-[calc(100vh-74px)] lg:border-l lg:border-t-0">
          <h2 className="text-xl font-black">Megjelenés</h2>
          <h3 className="mb-3 mt-6 font-bold">Háttér</h3>
          <div className="grid grid-cols-2 gap-2">
            {(
              Object.keys(
                backgroundPresets,
              ) as QuizAppearance["backgroundPreset"][]
            ).map((preset) => {
              const option = backgroundPresets[preset];
              const isSelected =
                appearance.backgroundMode === "preset" &&
                appearance.backgroundPreset === preset;
              return (
                <button
                  key={preset}
                  onClick={() => selectPreset(preset)}
                  className={`overflow-hidden rounded-lg border-2 text-left ${
                    isSelected ? "border-[#e0a20c]" : "border-[#8c8374]"
                  }`}
                >
                  <span
                    className="block h-16 bg-cover bg-center"
                    style={{ backgroundImage: option.background }}
                  />
                  <span className="block bg-[#fffaf0] px-2 py-1.5 text-xs font-bold">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#aa9d86] px-3 py-4 text-sm font-bold hover:bg-white/50">
            {uploadingMedia === "background" ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaImage />
            )}
            {uploadingMedia === "background"
              ? "Feltöltés…"
              : "Saját háttér feltöltése"}
            <input
              type="file"
              accept="image/*"
              disabled={uploadingMedia !== null}
              className="sr-only"
              onChange={(event) => {
                void handleBackgroundUpload(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>

          {mediaMessage ? (
            <p className="mt-2 text-xs text-[#756b5c]" aria-live="polite">
              {mediaMessage}
            </p>
          ) : null}

          {appearance.backgroundMode === "image" &&
          appearance.backgroundImage ? (
            <img
              src={appearance.backgroundImage}
              alt="Saját háttér előnézete"
              className="mt-3 h-28 w-full rounded-lg border border-[#8c8374] object-cover"
            />
          ) : null}

          <div className="mt-7 border-t border-[#cfc2aa] pt-5">
            <h3 className="font-bold">Szövegszín</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#756b5c]">
              A javaslat a háttér átlagos fényerejét használja. Részletes képnél
              kézzel is finomhangolhatod.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="color"
                value={appearance.textColor}
                onChange={(event) =>
                  setAppearance((current) => ({
                    ...current,
                    textColor: event.target.value,
                  }))
                }
                aria-label="Szövegszín"
                className="h-11 w-14 cursor-pointer rounded border border-[#8c8374] bg-transparent p-1"
              />
              <input
                value={textColorDraft}
                onChange={(event) => setTextColorDraft(event.target.value)}
                onBlur={() => {
                  if (/^#[0-9a-fA-F]{6}$/.test(textColorDraft)) {
                    setAppearance((current) => ({
                      ...current,
                      textColor: textColorDraft,
                    }));
                  } else {
                    setTextColorDraft(appearance.textColor);
                  }
                }}
                className={fieldClass}
                aria-label="Szövegszín hexadecimális értéke"
              />
            </div>
            <button
              onClick={() => void applySuggestedTextColor()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#8c8374] bg-[#fffaf0] px-3 py-2.5 text-sm font-bold hover:bg-[#ffd75a]"
            >
              <FaMagic /> Automatikus javaslat alkalmazása
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
