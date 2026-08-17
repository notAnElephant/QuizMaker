/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateQuiz(\n    $quizId: uuid!\n    $title: String!\n    $description: String\n    $ownerId: uuid!\n    $questions: [questions_insert_input!]!\n  ) {\n    insert_quizzes_one(\n      object: {\n        quiz_id: $quizId\n        title: $title\n        description: $description\n        owner_id: $ownerId\n      }\n    ) {\n      quiz_id\n    }\n    insert_questions(objects: $questions) {\n      affected_rows\n    }\n  }\n": typeof types.CreateQuizDocument,
    "\n  mutation UpdateQuiz(\n    $quizId: uuid!\n    $title: String!\n    $description: String\n    $ownerId: uuid!\n    $questions: [questions_insert_input!]!\n    $updatedAt: timestamp!\n  ) {\n    update_quizzes(\n      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }\n      _set: { title: $title, description: $description, updated_at: $updatedAt }\n    ) {\n      affected_rows\n    }\n    delete_questions(where: { quiz_id: { _eq: $quizId } }) {\n      affected_rows\n    }\n    insert_questions(objects: $questions) {\n      affected_rows\n    }\n  }\n": typeof types.UpdateQuizDocument,
    "\n  mutation SaveQuizPlays($plays: [quiz_plays_insert_input!]!) {\n    insert_quiz_plays(objects: $plays) {\n      affected_rows\n    }\n  }\n": typeof types.SaveQuizPlaysDocument,
    "\n  query GetProfileQuizzes($ownerId: uuid!) {\n    quizzes(\n      where: { owner_id: { _eq: $ownerId } }\n      order_by: [{ updated_at: desc }]\n    ) {\n      quiz_id\n      title\n      description\n      updated_at\n    }\n  }\n": typeof types.GetProfileQuizzesDocument,
    "\n  query GetSavedQuizzes($ownerId: uuid!) {\n    quizzes(\n      where: { owner_id: { _eq: $ownerId } }\n      order_by: [{ updated_at: desc }]\n    ) {\n      quiz_id\n      title\n      description\n      updated_at\n    }\n  }\n": typeof types.GetSavedQuizzesDocument,
    "\n  query GetSavedQuizQuestions($quizIds: [uuid!]!) {\n    questions(\n      where: { quiz_id: { _in: $quizIds } }\n      order_by: [{ category_name: asc }, { points: asc }]\n    ) {\n      question_id\n      quiz_id\n      question_text\n      question_type\n      points\n      answer_options\n      category_name\n    }\n  }\n": typeof types.GetSavedQuizQuestionsDocument,
    "\n  mutation DeleteQuiz($quizId: uuid!, $ownerId: uuid!) {\n    delete_quizzes(\n      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }\n    ) {\n      affected_rows\n    }\n  }\n": typeof types.DeleteQuizDocument,
    "\n  query GetCurrentUsers {\n    users(order_by: [{ display_name: asc }, { created_at: asc }]) {\n      user_id\n      display_name\n      email\n    }\n  }\n": typeof types.GetCurrentUsersDocument,
    "\n  mutation UpsertCurrentUser($userId: uuid!, $displayName: String, $email: String) {\n    insert_users_one(\n      object: {\n        user_id: $userId\n        display_name: $displayName\n        email: $email\n      }\n      on_conflict: {\n        constraint: users_pkey\n        update_columns: [display_name, email]\n      }\n    ) {\n      user_id\n      display_name\n      email\n    }\n  }\n": typeof types.UpsertCurrentUserDocument,
    "query GetQuestions {\n  questions(order_by: [{points: asc}]) {\n    question_id\n    question_text\n    question_type\n    points\n    answer_options\n    correct_answer\n    quiz_id\n  }\n}": typeof types.GetQuestionsDocument,
};
const documents: Documents = {
    "\n  mutation CreateQuiz(\n    $quizId: uuid!\n    $title: String!\n    $description: String\n    $ownerId: uuid!\n    $questions: [questions_insert_input!]!\n  ) {\n    insert_quizzes_one(\n      object: {\n        quiz_id: $quizId\n        title: $title\n        description: $description\n        owner_id: $ownerId\n      }\n    ) {\n      quiz_id\n    }\n    insert_questions(objects: $questions) {\n      affected_rows\n    }\n  }\n": types.CreateQuizDocument,
    "\n  mutation UpdateQuiz(\n    $quizId: uuid!\n    $title: String!\n    $description: String\n    $ownerId: uuid!\n    $questions: [questions_insert_input!]!\n    $updatedAt: timestamp!\n  ) {\n    update_quizzes(\n      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }\n      _set: { title: $title, description: $description, updated_at: $updatedAt }\n    ) {\n      affected_rows\n    }\n    delete_questions(where: { quiz_id: { _eq: $quizId } }) {\n      affected_rows\n    }\n    insert_questions(objects: $questions) {\n      affected_rows\n    }\n  }\n": types.UpdateQuizDocument,
    "\n  mutation SaveQuizPlays($plays: [quiz_plays_insert_input!]!) {\n    insert_quiz_plays(objects: $plays) {\n      affected_rows\n    }\n  }\n": types.SaveQuizPlaysDocument,
    "\n  query GetProfileQuizzes($ownerId: uuid!) {\n    quizzes(\n      where: { owner_id: { _eq: $ownerId } }\n      order_by: [{ updated_at: desc }]\n    ) {\n      quiz_id\n      title\n      description\n      updated_at\n    }\n  }\n": types.GetProfileQuizzesDocument,
    "\n  query GetSavedQuizzes($ownerId: uuid!) {\n    quizzes(\n      where: { owner_id: { _eq: $ownerId } }\n      order_by: [{ updated_at: desc }]\n    ) {\n      quiz_id\n      title\n      description\n      updated_at\n    }\n  }\n": types.GetSavedQuizzesDocument,
    "\n  query GetSavedQuizQuestions($quizIds: [uuid!]!) {\n    questions(\n      where: { quiz_id: { _in: $quizIds } }\n      order_by: [{ category_name: asc }, { points: asc }]\n    ) {\n      question_id\n      quiz_id\n      question_text\n      question_type\n      points\n      answer_options\n      category_name\n    }\n  }\n": types.GetSavedQuizQuestionsDocument,
    "\n  mutation DeleteQuiz($quizId: uuid!, $ownerId: uuid!) {\n    delete_quizzes(\n      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }\n    ) {\n      affected_rows\n    }\n  }\n": types.DeleteQuizDocument,
    "\n  query GetCurrentUsers {\n    users(order_by: [{ display_name: asc }, { created_at: asc }]) {\n      user_id\n      display_name\n      email\n    }\n  }\n": types.GetCurrentUsersDocument,
    "\n  mutation UpsertCurrentUser($userId: uuid!, $displayName: String, $email: String) {\n    insert_users_one(\n      object: {\n        user_id: $userId\n        display_name: $displayName\n        email: $email\n      }\n      on_conflict: {\n        constraint: users_pkey\n        update_columns: [display_name, email]\n      }\n    ) {\n      user_id\n      display_name\n      email\n    }\n  }\n": types.UpsertCurrentUserDocument,
    "query GetQuestions {\n  questions(order_by: [{points: asc}]) {\n    question_id\n    question_text\n    question_type\n    points\n    answer_options\n    correct_answer\n    quiz_id\n  }\n}": types.GetQuestionsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateQuiz(\n    $quizId: uuid!\n    $title: String!\n    $description: String\n    $ownerId: uuid!\n    $questions: [questions_insert_input!]!\n  ) {\n    insert_quizzes_one(\n      object: {\n        quiz_id: $quizId\n        title: $title\n        description: $description\n        owner_id: $ownerId\n      }\n    ) {\n      quiz_id\n    }\n    insert_questions(objects: $questions) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation CreateQuiz(\n    $quizId: uuid!\n    $title: String!\n    $description: String\n    $ownerId: uuid!\n    $questions: [questions_insert_input!]!\n  ) {\n    insert_quizzes_one(\n      object: {\n        quiz_id: $quizId\n        title: $title\n        description: $description\n        owner_id: $ownerId\n      }\n    ) {\n      quiz_id\n    }\n    insert_questions(objects: $questions) {\n      affected_rows\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateQuiz(\n    $quizId: uuid!\n    $title: String!\n    $description: String\n    $ownerId: uuid!\n    $questions: [questions_insert_input!]!\n    $updatedAt: timestamp!\n  ) {\n    update_quizzes(\n      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }\n      _set: { title: $title, description: $description, updated_at: $updatedAt }\n    ) {\n      affected_rows\n    }\n    delete_questions(where: { quiz_id: { _eq: $quizId } }) {\n      affected_rows\n    }\n    insert_questions(objects: $questions) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateQuiz(\n    $quizId: uuid!\n    $title: String!\n    $description: String\n    $ownerId: uuid!\n    $questions: [questions_insert_input!]!\n    $updatedAt: timestamp!\n  ) {\n    update_quizzes(\n      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }\n      _set: { title: $title, description: $description, updated_at: $updatedAt }\n    ) {\n      affected_rows\n    }\n    delete_questions(where: { quiz_id: { _eq: $quizId } }) {\n      affected_rows\n    }\n    insert_questions(objects: $questions) {\n      affected_rows\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SaveQuizPlays($plays: [quiz_plays_insert_input!]!) {\n    insert_quiz_plays(objects: $plays) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation SaveQuizPlays($plays: [quiz_plays_insert_input!]!) {\n    insert_quiz_plays(objects: $plays) {\n      affected_rows\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProfileQuizzes($ownerId: uuid!) {\n    quizzes(\n      where: { owner_id: { _eq: $ownerId } }\n      order_by: [{ updated_at: desc }]\n    ) {\n      quiz_id\n      title\n      description\n      updated_at\n    }\n  }\n"): (typeof documents)["\n  query GetProfileQuizzes($ownerId: uuid!) {\n    quizzes(\n      where: { owner_id: { _eq: $ownerId } }\n      order_by: [{ updated_at: desc }]\n    ) {\n      quiz_id\n      title\n      description\n      updated_at\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSavedQuizzes($ownerId: uuid!) {\n    quizzes(\n      where: { owner_id: { _eq: $ownerId } }\n      order_by: [{ updated_at: desc }]\n    ) {\n      quiz_id\n      title\n      description\n      updated_at\n    }\n  }\n"): (typeof documents)["\n  query GetSavedQuizzes($ownerId: uuid!) {\n    quizzes(\n      where: { owner_id: { _eq: $ownerId } }\n      order_by: [{ updated_at: desc }]\n    ) {\n      quiz_id\n      title\n      description\n      updated_at\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSavedQuizQuestions($quizIds: [uuid!]!) {\n    questions(\n      where: { quiz_id: { _in: $quizIds } }\n      order_by: [{ category_name: asc }, { points: asc }]\n    ) {\n      question_id\n      quiz_id\n      question_text\n      question_type\n      points\n      answer_options\n      category_name\n    }\n  }\n"): (typeof documents)["\n  query GetSavedQuizQuestions($quizIds: [uuid!]!) {\n    questions(\n      where: { quiz_id: { _in: $quizIds } }\n      order_by: [{ category_name: asc }, { points: asc }]\n    ) {\n      question_id\n      quiz_id\n      question_text\n      question_type\n      points\n      answer_options\n      category_name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteQuiz($quizId: uuid!, $ownerId: uuid!) {\n    delete_quizzes(\n      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }\n    ) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteQuiz($quizId: uuid!, $ownerId: uuid!) {\n    delete_quizzes(\n      where: { quiz_id: { _eq: $quizId }, owner_id: { _eq: $ownerId } }\n    ) {\n      affected_rows\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetCurrentUsers {\n    users(order_by: [{ display_name: asc }, { created_at: asc }]) {\n      user_id\n      display_name\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentUsers {\n    users(order_by: [{ display_name: asc }, { created_at: asc }]) {\n      user_id\n      display_name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpsertCurrentUser($userId: uuid!, $displayName: String, $email: String) {\n    insert_users_one(\n      object: {\n        user_id: $userId\n        display_name: $displayName\n        email: $email\n      }\n      on_conflict: {\n        constraint: users_pkey\n        update_columns: [display_name, email]\n      }\n    ) {\n      user_id\n      display_name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation UpsertCurrentUser($userId: uuid!, $displayName: String, $email: String) {\n    insert_users_one(\n      object: {\n        user_id: $userId\n        display_name: $displayName\n        email: $email\n      }\n      on_conflict: {\n        constraint: users_pkey\n        update_columns: [display_name, email]\n      }\n    ) {\n      user_id\n      display_name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetQuestions {\n  questions(order_by: [{points: asc}]) {\n    question_id\n    question_text\n    question_type\n    points\n    answer_options\n    correct_answer\n    quiz_id\n  }\n}"): (typeof documents)["query GetQuestions {\n  questions(order_by: [{points: asc}]) {\n    question_id\n    question_text\n    question_type\n    points\n    answer_options\n    correct_answer\n    quiz_id\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;