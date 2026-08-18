import { Category } from "../context/types";
import { Question, QuestionType } from "../models/Question";

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
          typeof rawQuestion.type !== "string" ||
          !questionTypes.has(rawQuestion.type as QuestionType)
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

        return new Question(
          rawQuestion.type as QuestionType,
          rawQuestion.content,
          optionalString(rawQuestion.source, "source", questionLocation),
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
          optionalString(
            rawQuestion.answerSource,
            "answerSource",
            questionLocation,
          ),
        );
      }),
    };
  });
}
