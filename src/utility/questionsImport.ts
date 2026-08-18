import type { Category } from "../context/types";
import { Question } from "../models/Question";
import type { AnswerMediaType, QuestionType } from "../models/Question";

const questionTypes = new Set<QuestionType>([
  "text",
  "image",
  "video",
  "audio",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown, fieldName: string, location: string) {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new Error(
      `${location}: a(z) „${fieldName}” mezőnek szövegnek kell lennie.`,
    );
  }
  return value;
}

function validateMediaFilename(
  value: string | undefined,
  fieldName: "answerSource" | "source",
  location: string,
) {
  if (!value) return;

  if (
    value !== value.trim() ||
    value.includes("/") ||
    value.includes("\\") ||
    value === "." ||
    value === ".."
  ) {
    throw new Error(
      `${location}: a(z) „${fieldName}” mezőben csak a médiafájl neve szerepelhet (például: kep.jpg).`,
    );
  }
}

export type UploadedImportMedia = {
  type: AnswerMediaType;
  url: string;
};

export function getRequiredMediaFilenames(categories: Category[]) {
  const filenames = new Set<string>();

  categories.forEach((category) => {
    category.questions.forEach((question) => {
      if (question.source) filenames.add(question.source);
      if (question.answerSource) filenames.add(question.answerSource);
    });
  });

  return [...filenames];
}

export function resolveImportedMedia(
  categories: Category[],
  uploadedMedia: Map<string, UploadedImportMedia>,
) {
  return categories.map((category) => ({
    ...category,
    questions: category.questions.map((question) => {
      const questionMedia = question.source
        ? uploadedMedia.get(question.source)
        : undefined;
      const answerMedia = question.answerSource
        ? uploadedMedia.get(question.answerSource)
        : undefined;

      return new Question(
        questionMedia?.type ?? "text",
        question.content,
        questionMedia?.url,
        question.points,
        question.isUsed,
        question.list,
        question.correctAnswer,
        question.revealAnswer,
        answerMedia?.type,
        answerMedia?.url,
      );
    }),
  }));
}

export function parseQuestionsJson(contents: string): Category[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(contents);
  } catch {
    throw new Error("A kiválasztott fájl nem érvényes JSON.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(
      "A JSON gyökerének egy nem üres kategórialistának kell lennie.",
    );
  }

  return parsed.map((rawCategory, categoryIndex) => {
    const categoryLocation = `${categoryIndex + 1}. kategória`;
    if (!isRecord(rawCategory)) {
      throw new Error(`${categoryLocation}: érvénytelen kategória.`);
    }
    if (typeof rawCategory.category !== "string") {
      throw new Error(
        `${categoryLocation}: a „category” mező megadása kötelező.`,
      );
    }
    if (!Array.isArray(rawCategory.questions)) {
      throw new Error(
        `${categoryLocation}: a „questions” mezőnek listának kell lennie.`,
      );
    }

    return {
      category: rawCategory.category,
      questions: rawCategory.questions.map((rawQuestion, questionIndex) => {
        const questionLocation = `${categoryLocation}, ${questionIndex + 1}. kérdés`;
        if (!isRecord(rawQuestion)) {
          throw new Error(`${questionLocation}: érvénytelen kérdés.`);
        }
        if (typeof rawQuestion.content !== "string") {
          throw new Error(
            `${questionLocation}: a „content” mező megadása kötelező.`,
          );
        }
        if (
          rawQuestion.type !== undefined &&
          (typeof rawQuestion.type !== "string" ||
            !questionTypes.has(rawQuestion.type as QuestionType))
        ) {
          throw new Error(
            `${questionLocation}: a „type” értéke text, image, video vagy audio lehet.`,
          );
        }
        if (
          rawQuestion.points !== undefined &&
          (typeof rawQuestion.points !== "number" ||
            !Number.isFinite(rawQuestion.points) ||
            rawQuestion.points < 0)
        ) {
          throw new Error(`${questionLocation}: a „points” mező érvénytelen.`);
        }
        if (
          rawQuestion.list !== undefined &&
          (!Array.isArray(rawQuestion.list) ||
            !rawQuestion.list.every((item) => typeof item === "string"))
        ) {
          throw new Error(
            `${questionLocation}: a „list” csak szövegeket tartalmazhat.`,
          );
        }
        if (
          rawQuestion.isUsed !== undefined &&
          typeof rawQuestion.isUsed !== "boolean"
        ) {
          throw new Error(
            `${questionLocation}: az „isUsed” mezőnek logikai értéknek kell lennie.`,
          );
        }
        if (
          rawQuestion.revealAnswer !== undefined &&
          typeof rawQuestion.revealAnswer !== "boolean"
        ) {
          throw new Error(
            `${questionLocation}: a „revealAnswer” mezőnek logikai értéknek kell lennie.`,
          );
        }
        if (
          rawQuestion.answerMediaType !== undefined &&
          !["image", "video", "audio"].includes(
            rawQuestion.answerMediaType as string,
          )
        ) {
          throw new Error(
            `${questionLocation}: az „answerMediaType” értéke image, video vagy audio lehet.`,
          );
        }

        const source = optionalString(
          rawQuestion.source,
          "source",
          questionLocation,
        );
        const answerSource = optionalString(
          rawQuestion.answerSource,
          "answerSource",
          questionLocation,
        );
        validateMediaFilename(source, "source", questionLocation);
        validateMediaFilename(answerSource, "answerSource", questionLocation);

        return new Question(
          (rawQuestion.type as QuestionType | undefined) ??
            (source ? "image" : "text"),
          rawQuestion.content,
          source,
          (rawQuestion.points as number | undefined) ??
            (questionIndex + 1) * 1000,
          (rawQuestion.isUsed as boolean | undefined) ?? false,
          rawQuestion.list as string[] | undefined,
          optionalString(
            rawQuestion.correctAnswer,
            "correctAnswer",
            questionLocation,
          ),
          (rawQuestion.revealAnswer as boolean | undefined) ?? false,
          rawQuestion.answerMediaType as
            | "image"
            | "video"
            | "audio"
            | undefined,
          answerSource,
        );
      }),
    };
  });
}
