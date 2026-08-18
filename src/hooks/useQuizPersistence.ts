import { gql, type ApolloCache } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import { useQuiz } from "../context/QuizContext";
import { useCurrentUser } from "../context/useCurrentUser";
import { buildStoredQuestionText } from "../utility/quizPersistence";

const CREATE_QUIZ_MUTATION = gql`
  mutation CreateQuiz(
    $quizId: uuid!
    $title: String!
    $description: String
    $ownerId: uuid!
    $backgroundMode: String!
    $backgroundPreset: String!
    $backgroundImage: String
    $textColor: String!
    $questions: [questions_insert_input!]!
  ) {
    insert_quizzes_one(
      object: {
        quiz_id: $quizId
        title: $title
        description: $description
        owner_id: $ownerId
        background_mode: $backgroundMode
        background_preset: $backgroundPreset
        background_image: $backgroundImage
        text_color: $textColor
      }
    ) {
      quiz_id
    }
    insert_questions(objects: $questions) {
      affected_rows
    }
  }
`;

const UPDATE_QUIZ_MUTATION = gql`
  mutation UpdateQuiz(
    $quizId: uuid!
    $title: String!
    $description: String
    $ownerId: uuid!
    $backgroundMode: String!
    $backgroundPreset: String!
    $backgroundImage: String
    $textColor: String!
    $questions: [questions_insert_input!]!
    $updatedAt: timestamp!
  ) {
    update_quizzes(
      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }
      _set: {
        title: $title
        description: $description
        background_mode: $backgroundMode
        background_preset: $backgroundPreset
        background_image: $backgroundImage
        text_color: $textColor
        updated_at: $updatedAt
      }
    ) {
      affected_rows
    }
    delete_questions(where: { quiz_id: { _eq: $quizId } }) {
      affected_rows
    }
    insert_questions(objects: $questions) {
      affected_rows
    }
  }
`;

function invalidateSavedQuizzes(cache: ApolloCache) {
  cache.evict({ id: "ROOT_QUERY", fieldName: "quizzes" });
  cache.evict({ id: "ROOT_QUERY", fieldName: "questions" });
  cache.gc();
}

export function useQuizPersistence() {
  const {
    appearance,
    categories,
    currentQuizDescription,
    currentQuizId,
    currentQuizTitle,
    setCurrentQuizId,
  } = useQuiz();
  const { currentUser } = useCurrentUser();
  const [createQuiz, { loading: isCreating }] =
    useMutation(CREATE_QUIZ_MUTATION);
  const [updateQuiz, { loading: isUpdating }] =
    useMutation(UPDATE_QUIZ_MUTATION);

  const persistQuiz = useCallback(async () => {
    if (!currentUser) {
      throw new Error("Nincs kiválasztott felhasználó a mentéshez.");
    }

    const title = currentQuizTitle.trim();
    if (!title) throw new Error("A kvíz címe nem lehet üres.");
    if (!categories.length)
      throw new Error("Adj hozzá legalább egy kategóriát.");
    if (categories.some((category) => !category.category.trim())) {
      throw new Error("Minden kategóriának adj nevet.");
    }

    const quizId = currentQuizId ?? crypto.randomUUID();
    const questions = categories.flatMap((category) =>
      category.questions.map((question) => ({
        answer_options: question.list?.length ? question.list : [],
        answer_media_source: question.answerSource?.trim() || null,
        answer_media_type: question.answerSource
          ? question.answerMediaType || "image"
          : null,
        category_name: category.category,
        correct_answer: question.correctAnswer?.trim() || null,
        points: question.points,
        question_id: crypto.randomUUID(),
        question_text: buildStoredQuestionText(
          question.content,
          question.source,
        ),
        question_type: question.type,
        quiz_id: quizId,
        reveal_answer: question.revealAnswer,
      })),
    );

    const variables = {
      backgroundImage:
        appearance.backgroundMode === "image"
          ? appearance.backgroundImage || null
          : null,
      backgroundMode: appearance.backgroundMode,
      backgroundPreset: appearance.backgroundPreset,
      description: currentQuizDescription.trim() || null,
      ownerId: currentUser.user_id,
      questions,
      quizId,
      textColor: appearance.textColor,
      title,
    };

    if (currentQuizId) {
      await updateQuiz({
        update: invalidateSavedQuizzes,
        variables: { ...variables, updatedAt: new Date().toISOString() },
      });
    } else {
      await createQuiz({ update: invalidateSavedQuizzes, variables });
      setCurrentQuizId(quizId);
    }

    return { quizId, title, wasUpdate: Boolean(currentQuizId) };
  }, [
    appearance,
    categories,
    createQuiz,
    currentQuizDescription,
    currentQuizId,
    currentQuizTitle,
    currentUser,
    setCurrentQuizId,
    updateQuiz,
  ]);

  return { isSaving: isCreating || isUpdating, persistQuiz };
}
