import { Category } from "../context/types";
import { Question, QuestionType } from "../models/Question";

const SOURCE_MARKER = " [SOURCE: ";

export function buildStoredQuestionText(content: string, source?: string) {
  return source ? `${content}${SOURCE_MARKER}${source}]` : content;
}

export function parseStoredQuestionText(questionText: string) {
  const sourceStart = questionText.indexOf(SOURCE_MARKER);

  if (sourceStart === -1 || !questionText.endsWith("]")) {
    return { content: questionText, source: undefined };
  }

  const content = questionText.slice(0, sourceStart);
  const source = questionText.slice(
    sourceStart + SOURCE_MARKER.length,
    questionText.length - 1,
  );

  return { content, source };
}

type PersistedQuestion = {
  answer_options?: string[] | null;
  category_name: string;
  correct_answer?: string | null;
  points?: number | null;
  question_text: string;
  question_type: string;
};

export function buildCategoriesFromPersistedQuestions(
  questions: PersistedQuestion[],
): Category[] {
  const categories = new Map<string, Question[]>();

  for (const question of questions) {
    const { content, source } = parseStoredQuestionText(question.question_text);
    const categoryQuestions = categories.get(question.category_name) ?? [];

    categoryQuestions.push(
      new Question(
        question.question_type as QuestionType,
        content,
        source,
        question.points ?? 1000,
        false,
        question.answer_options?.length ? question.answer_options : undefined,
        question.correct_answer ?? undefined,
      ),
    );

    categories.set(question.category_name, categoryQuestions);
  }

  return Array.from(categories.entries()).map(
    ([category, groupedQuestions]) => ({
      category,
      questions: groupedQuestions.sort((a, b) => a.points - b.points),
    }),
  );
}
