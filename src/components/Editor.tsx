import { DragEvent, useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
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
import { toast } from "sonner";
import { useQuiz } from "../context/QuizContext";
import type { Category, QuizAppearance } from "../context/types";
import { useConfirm } from "../context/useConfirm";
import { useCurrentUser } from "../context/useCurrentUser";
import { useQuizPersistence } from "../hooks/useQuizPersistence";
import type { AnswerMediaType } from "../models/Question";
import {
  getRequiredMediaFilenames,
  parseQuestionsJson,
  resolveImportedMedia,
} from "../utility/questionsImport";
import {
  backgroundPresets,
  getSuggestedTextColor,
  suggestTextColorForImage,
} from "../utility/quizAppearance";
import {
  canUseQuizMediaStorage,
  deleteQuizBackground,
  deleteUploadedQuizMedia,
  listQuizBackgrounds,
  type UploadedQuizBackground,
  uploadQuizBackground,
  uploadQuizMedia,
} from "../utility/quizMediaStorage";
import UserSwitcher from "./UserSwitcher";

type DraggedQuestion = {
  sourceCatIndex: number;
  sourceQuestionIndex: number;
};

type PendingQuestionsImport = {
  categories: Category[];
  fileName: string;
  mediaFilenames: string[];
};

function MediaPreview({
  source,
  type,
  label,
}: {
  source: string;
  type: AnswerMediaType;
  label: string;
}) {
  if (type === "image") {
    return (
      <img src={source} alt={label} className="h-44 w-full object-contain" />
    );
  }
  if (type === "video") {
    return (
      <video
        src={source}
        controls
        aria-label={label}
        className="h-44 w-full object-contain"
      />
    );
  }
  return (
    <div className="grid min-h-24 place-items-center px-4">
      <audio src={source} controls aria-label={label} className="max-w-full" />
    </div>
  );
}

const fieldClass =
  "w-full rounded-lg border border-[#8c8374] bg-[#fffdf7] px-3 py-2 text-sm text-[#24211c] outline-none transition focus:border-[#d48313] focus:ring-2 focus:ring-[#ffd75a]/60";

export default function Editor() {
  const navigate = useNavigate();
  const confirm = useConfirm();
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
  const [pendingImport, setPendingImport] =
    useState<PendingQuestionsImport | null>(null);
  const [customBackgrounds, setCustomBackgrounds] = useState<
    UploadedQuizBackground[]
  >([]);
  const [uploadingMedia, setUploadingMedia] = useState<
    "answer" | "background" | "import" | "question" | null
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

  useEffect(() => {
    if (!canUseQuizMediaStorage || !currentUser) return;

    let isCurrent = true;
    void listQuizBackgrounds()
      .then((backgrounds) => {
        if (isCurrent) setCustomBackgrounds(backgrounds);
      })
      .catch((error) => {
        if (isCurrent) {
          toast.error(
            error instanceof Error
              ? error.message
              : "A saját hátterek betöltése nem sikerült.",
          );
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [currentUser]);

  const saveQuiz = async () => {
    try {
      const result = await persistQuiz();
      toast.success(
        result.wasUpdate ? "Módosítások elmentve" : "Kvíz létrehozva",
      );
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "A mentés nem sikerült.",
      );
      return false;
    }
  };

  const handleBackgroundUpload = async (file?: File) => {
    if (!file) return;
    setUploadingMedia("background");
    try {
      const uploaded = await uploadQuizBackground(file);
      const textColor = await suggestTextColorForImage(uploaded.url);
      setAppearance((current) => ({
        ...current,
        backgroundImage: uploaded.url,
        backgroundMode: "image",
        textColor,
      }));
      setCustomBackgrounds((current) => [uploaded, ...current]);
      toast.success("A háttérkép feltöltve.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "A feltöltés nem sikerült.",
      );
    } finally {
      setUploadingMedia(null);
    }
  };

  const selectCustomBackground = async (background: UploadedQuizBackground) => {
    const textColor = await suggestTextColorForImage(background.url);
    setAppearance((current) => ({
      ...current,
      backgroundImage: background.url,
      backgroundMode: "image",
      textColor,
    }));
  };

  const removeCustomBackground = async (background: UploadedQuizBackground) => {
    const shouldDelete = await confirm({
      confirmLabel: "Háttér törlése",
      description:
        "A kép végleg törlődik a saját háttérképeid közül. Ez a művelet nem vonható vissza.",
      destructive: true,
      title: "Háttérkép törlése",
    });
    if (!shouldDelete) return;

    try {
      await deleteQuizBackground(background.objectPath);
      setCustomBackgrounds((current) =>
        current.filter((item) => item.objectPath !== background.objectPath),
      );
      if (appearance.backgroundImage === background.url) {
        selectPreset("default");
      }
      toast.success("A háttérkép törölve.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "A törlés nem sikerült.",
      );
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

  const handleQuestionMediaUpload = async (file?: File) => {
    if (!file || !activeQuestion) return;
    setUploadingMedia("question");
    try {
      const uploaded = await uploadQuizMedia(file);
      updateQuestion(selectedCategory, selectedQuestion, {
        source: uploaded.url,
        type: uploaded.type,
      });
      toast.success("A kérdés médiája feltöltve.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "A feltöltés nem sikerült.",
      );
    } finally {
      setUploadingMedia(null);
    }
  };

  const handleAnswerMediaUpload = async (file?: File) => {
    if (!file || !activeQuestion) return;
    setUploadingMedia("answer");
    try {
      const uploaded = await uploadQuizMedia(file);
      updateQuestion(selectedCategory, selectedQuestion, {
        answerMediaType: uploaded.type,
        answerSource: uploaded.url,
      });
      toast.success("A válasz médiája feltöltve.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "A feltöltés nem sikerült.",
      );
    } finally {
      setUploadingMedia(null);
    }
  };

  const handleQuestionsImport = async (file?: File) => {
    if (!file) return;
    setPendingImport(null);

    try {
      const nextCategories = parseQuestionsJson(await file.text());
      const shouldImport = await confirm({
        confirmLabel: "Kérdések cseréje",
        description: `A fájl ${nextCategories.length} kategóriát tartalmaz. A szerkesztő jelenlegi kérdései lecserélődnek.`,
        destructive: true,
        title: "JSON importálása",
      });
      if (!shouldImport) {
        return;
      }

      const mediaFilenames = getRequiredMediaFilenames(nextCategories);
      if (mediaFilenames.length > 0) {
        setPendingImport({
          categories: nextCategories,
          fileName: file.name,
          mediaFilenames,
        });
        toast.info(
          `A JSON ${mediaFilenames.length} médiafájlt hivatkozik. Válaszd ki mindet az importálás befejezéséhez.`,
        );
        return;
      }

      importCategories(nextCategories);
      setSelectedCategory(0);
      setSelectedQuestion(0);
      toast.success(
        `${file.name} importálva (${nextCategories.length} kategória).`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Az importálás nem sikerült.",
      );
    }
  };

  const handleImportMediaUpload = async (files?: FileList | null) => {
    if (!files || !pendingImport) return;

    const selectedFiles = new Map(
      Array.from(files).map((file) => [file.name, file]),
    );
    const missingFiles = pendingImport.mediaFilenames.filter(
      (filename) => !selectedFiles.has(filename),
    );
    if (missingFiles.length > 0) {
      toast.error(`Hiányzó fájlok: ${missingFiles.join(", ")}`);
      return;
    }

    setUploadingMedia("import");
    const importToastId = toast.loading("Médiafájlok feltöltése…");
    const successfulUploads: Array<
      [string, Awaited<ReturnType<typeof uploadQuizMedia>>]
    > = [];
    try {
      for (const filename of pendingImport.mediaFilenames) {
        const file = selectedFiles.get(filename);
        if (!file) throw new Error(`Hiányzó fájl: ${filename}`);
        successfulUploads.push([filename, await uploadQuizMedia(file)]);
      }
      const nextCategories = resolveImportedMedia(
        pendingImport.categories,
        new Map(
          successfulUploads.map(([filename, uploaded]) => [
            filename,
            { type: uploaded.type, url: uploaded.url },
          ]),
        ),
      );
      const importedFileName = pendingImport.fileName;
      const categoryCount = pendingImport.categories.length;

      importCategories(nextCategories);
      setPendingImport(null);
      setSelectedCategory(0);
      setSelectedQuestion(0);
      toast.success(
        `${importedFileName} és ${successfulUploads.length} médiafájl importálva (${categoryCount} kategória).`,
        { id: importToastId },
      );
    } catch (error) {
      await Promise.allSettled(
        successfulUploads.map(([, uploaded]) =>
          deleteUploadedQuizMedia(uploaded.objectPath),
        ),
      );
      toast.error(
        error instanceof Error ? error.message : "Az importálás nem sikerült.",
        { id: importToastId },
      );
    } finally {
      setUploadingMedia(null);
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
              Kvízszerkesztő
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
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
            {pendingImport ? (
              <div className="grid gap-3 rounded-xl border border-[#d48313] bg-[#fff8e7] p-3 text-xs">
                <div>
                  <strong className="block text-sm">
                    Szükséges médiafájlok
                  </strong>
                  <ul className="mt-2 grid gap-1 break-all text-[#756b5c]">
                    {pendingImport.mediaFilenames.map((filename) => (
                      <li key={filename}>• {filename}</li>
                    ))}
                  </ul>
                </div>
                <label className="editor-secondary-action cursor-pointer justify-center">
                  {uploadingMedia === "import" ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaFileImport />
                  )}
                  {uploadingMedia === "import"
                    ? "Feltöltés…"
                    : "Fájlok kiválasztása"}
                  <input
                    type="file"
                    accept="image/*,audio/*,video/*"
                    multiple
                    disabled={uploadingMedia !== null}
                    className="sr-only"
                    onChange={(event) => {
                      void handleImportMediaUpload(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={uploadingMedia !== null}
                  onClick={() => {
                    setPendingImport(null);
                    toast.info("Az importálás megszakítva.");
                  }}
                  className="text-[#756b5c] underline disabled:opacity-50"
                >
                  Mégse
                </button>
              </div>
            ) : null}
            <button
              onClick={async () => {
                const shouldCreate = await confirm({
                  confirmLabel: "Új kvíz kezdése",
                  description:
                    "A nem mentett módosítások elvesznek, amikor új kvízt kezdesz.",
                  destructive: true,
                  title: "Új kvíz",
                });
                if (!shouldCreate) return;

                createQuiz("Új kvíz", ["Új kategória"], 1);
                setSelectedCategory(0);
                setSelectedQuestion(0);
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
                  onClick={async () => {
                    const shouldDelete = await confirm({
                      confirmLabel: "Kategória törlése",
                      description: `A(z) „${activeCategory.category || "Névtelen kategória"}” kategória és minden kérdése végleg törlődik.`,
                      destructive: true,
                      title: "Kategória törlése",
                    });
                    if (shouldDelete) removeCategory(selectedCategory);
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
                          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
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
                                Kérdés médiája
                              </span>
                              {question.source ? (
                                <div className="relative mt-1 overflow-hidden rounded-xl border border-[#8c8374] bg-[#e9dfca]">
                                  <MediaPreview
                                    source={question.source}
                                    type={
                                      question.type === "text"
                                        ? "image"
                                        : question.type
                                    }
                                    label="Kérdés médiája"
                                  />
                                  <button
                                    onClick={() =>
                                      updateQuestion(selectedCategory, qIndex, {
                                        source: "",
                                        type: "text",
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
                                  : "Média hozzáadása"}
                                <input
                                  type="file"
                                  accept="image/*,audio/*,video/*"
                                  disabled={uploadingMedia !== null}
                                  className="sr-only"
                                  onChange={(event) => {
                                    void handleQuestionMediaUpload(
                                      event.target.files?.[0],
                                    );
                                    event.target.value = "";
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="mt-4 rounded-xl border border-[#cfc2aa] bg-white/35 p-4">
                            <span className="editor-field-label">
                              Válasz médiája
                            </span>
                            {question.answerSource ? (
                              <div className="relative mt-3 overflow-hidden rounded-xl border border-[#8c8374] bg-[#e9dfca]">
                                <MediaPreview
                                  source={question.answerSource}
                                  type={question.answerMediaType ?? "image"}
                                  label="Válasz médiája"
                                />
                                <button
                                  onClick={() =>
                                    updateQuestion(selectedCategory, qIndex, {
                                      answerSource: "",
                                      answerMediaType: undefined,
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
                                : "Válaszmédia feltöltése"}
                              <input
                                type="file"
                                accept="image/*,audio/*,video/*"
                                disabled={uploadingMedia !== null}
                                className="sr-only"
                                onChange={(event) => {
                                  void handleAnswerMediaUpload(
                                    event.target.files?.[0],
                                  );
                                  event.target.value = "";
                                }}
                              />
                            </label>
                          </div>

                          <div className="mt-5 flex justify-end">
                            <button
                              onClick={async () => {
                                const shouldDelete = await confirm({
                                  confirmLabel: "Kérdés törlése",
                                  description:
                                    "A kérdés végleg törlődik a kategóriából. Ez a művelet nem vonható vissza.",
                                  destructive: true,
                                  title: "Kérdés törlése",
                                });
                                if (shouldDelete) {
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

          {customBackgrounds.length ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {customBackgrounds.map((background) => {
                const isSelected =
                  appearance.backgroundMode === "image" &&
                  appearance.backgroundImage === background.url;

                return (
                  <div
                    key={background.objectPath}
                    className={`relative overflow-hidden rounded-lg border-2 ${
                      isSelected ? "border-[#e0a20c]" : "border-[#8c8374]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => void selectCustomBackground(background)}
                      className="block w-full"
                      aria-label="Saját háttér kiválasztása"
                    >
                      <img
                        src={background.url}
                        alt="Saját háttér"
                        className="h-20 w-full object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeCustomBackground(background)}
                      className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-[#24211c] text-white shadow"
                      aria-label="Saját háttér törlése"
                      title="Háttér törlése"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}

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
