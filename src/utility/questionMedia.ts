const bundledQuestionMedia = new Set([
  "hult-helye-answer-1.jpg",
  "hult-helye-answer-2.jpg",
  "hult-helye-answer-3.jpg",
  "hult-helye-answer-4.jpg",
  "hult-helye-answer-5.jpg",
  "hult-helye-question-1.png",
  "hult-helye-question-2.png",
  "hult-helye-question-3.jpg",
  "hult-helye-question-4.png",
  "hult-helye-question-5.png",
]);

export function resolveQuestionMediaSource(source?: string) {
  return source && bundledQuestionMedia.has(source)
    ? `/question-media/${source}`
    : source;
}

export function resolveQuestionMediaType(
  type: unknown,
  source?: string,
): QuestionType {
  if (type === "image" || type === "video" || type === "audio") return type;

  return source && /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(source)
    ? "image"
    : "text";
}
import type { QuestionType } from "../models/Question";
