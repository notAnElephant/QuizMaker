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
    "\n  query GetUsers {\n    users(limit: 1) {\n      user_id\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  mutation CreateUser($id: uuid!, $name: String!) {\n    insert_users_one(object: {user_id: $id, display_name: $name}) {\n      user_id\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation CreateQuiz($id: uuid!, $title: String!, $owner_id: uuid!) {\n    insert_quizzes_one(object: {quiz_id: $id, title: $title, owner_id: $owner_id}) {\n      quiz_id\n    }\n  }\n": typeof types.CreateQuizDocument,
    "\n  mutation CreateQuestion(\n    $id: uuid!,\n    $text: String!, \n    $type: String!, \n    $points: Int!, \n    $quiz_id: uuid!, \n    $options: [String!]\n  ) {\n    insert_questions_one(object: {\n      question_id: $id,\n      question_text: $text, \n      question_type: $type, \n      points: $points, \n      quiz_id: $quiz_id, \n      answer_options: $options\n    }) {\n      question_id\n    }\n  }\n": typeof types.CreateQuestionDocument,
    "\n      mutation DeleteQuestion($id: uuid!) {\n        delete_questions_by_pk(question_id: $id) {\n          question_id\n        }\n      }\n    ": typeof types.DeleteQuestionDocument,
    "\n      query GetAllQuestions {\n        questions {\n          question_id\n          question_text\n        }\n      }\n    ": typeof types.GetAllQuestionsDocument,
    "\n    mutation NukeQuestions {\n      delete_questions(where: {}) {\n        affected_rows\n      }\n    }\n  ": typeof types.NukeQuestionsDocument,
    "\n    mutation NukeQuizzes {\n      delete_quizzes(where: {}) {\n        affected_rows\n      }\n    }\n  ": typeof types.NukeQuizzesDocument,
    "\n    mutation NukeUsers {\n      delete_users(where: {}) {\n        affected_rows\n      }\n    }\n  ": typeof types.NukeUsersDocument,
    "query GetQuestions {\n  questions(order_by: [{points: asc}]) {\n    question_id\n    question_text\n    question_type\n    points\n    answer_options\n    correct_answer\n    quiz_id\n  }\n}": typeof types.GetQuestionsDocument,
};
const documents: Documents = {
    "\n  query GetUsers {\n    users(limit: 1) {\n      user_id\n    }\n  }\n": types.GetUsersDocument,
    "\n  mutation CreateUser($id: uuid!, $name: String!) {\n    insert_users_one(object: {user_id: $id, display_name: $name}) {\n      user_id\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation CreateQuiz($id: uuid!, $title: String!, $owner_id: uuid!) {\n    insert_quizzes_one(object: {quiz_id: $id, title: $title, owner_id: $owner_id}) {\n      quiz_id\n    }\n  }\n": types.CreateQuizDocument,
    "\n  mutation CreateQuestion(\n    $id: uuid!,\n    $text: String!, \n    $type: String!, \n    $points: Int!, \n    $quiz_id: uuid!, \n    $options: [String!]\n  ) {\n    insert_questions_one(object: {\n      question_id: $id,\n      question_text: $text, \n      question_type: $type, \n      points: $points, \n      quiz_id: $quiz_id, \n      answer_options: $options\n    }) {\n      question_id\n    }\n  }\n": types.CreateQuestionDocument,
    "\n      mutation DeleteQuestion($id: uuid!) {\n        delete_questions_by_pk(question_id: $id) {\n          question_id\n        }\n      }\n    ": types.DeleteQuestionDocument,
    "\n      query GetAllQuestions {\n        questions {\n          question_id\n          question_text\n        }\n      }\n    ": types.GetAllQuestionsDocument,
    "\n    mutation NukeQuestions {\n      delete_questions(where: {}) {\n        affected_rows\n      }\n    }\n  ": types.NukeQuestionsDocument,
    "\n    mutation NukeQuizzes {\n      delete_quizzes(where: {}) {\n        affected_rows\n      }\n    }\n  ": types.NukeQuizzesDocument,
    "\n    mutation NukeUsers {\n      delete_users(where: {}) {\n        affected_rows\n      }\n    }\n  ": types.NukeUsersDocument,
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
export function gql(source: "\n  query GetUsers {\n    users(limit: 1) {\n      user_id\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users(limit: 1) {\n      user_id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($id: uuid!, $name: String!) {\n    insert_users_one(object: {user_id: $id, display_name: $name}) {\n      user_id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($id: uuid!, $name: String!) {\n    insert_users_one(object: {user_id: $id, display_name: $name}) {\n      user_id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateQuiz($id: uuid!, $title: String!, $owner_id: uuid!) {\n    insert_quizzes_one(object: {quiz_id: $id, title: $title, owner_id: $owner_id}) {\n      quiz_id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateQuiz($id: uuid!, $title: String!, $owner_id: uuid!) {\n    insert_quizzes_one(object: {quiz_id: $id, title: $title, owner_id: $owner_id}) {\n      quiz_id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateQuestion(\n    $id: uuid!,\n    $text: String!, \n    $type: String!, \n    $points: Int!, \n    $quiz_id: uuid!, \n    $options: [String!]\n  ) {\n    insert_questions_one(object: {\n      question_id: $id,\n      question_text: $text, \n      question_type: $type, \n      points: $points, \n      quiz_id: $quiz_id, \n      answer_options: $options\n    }) {\n      question_id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateQuestion(\n    $id: uuid!,\n    $text: String!, \n    $type: String!, \n    $points: Int!, \n    $quiz_id: uuid!, \n    $options: [String!]\n  ) {\n    insert_questions_one(object: {\n      question_id: $id,\n      question_text: $text, \n      question_type: $type, \n      points: $points, \n      quiz_id: $quiz_id, \n      answer_options: $options\n    }) {\n      question_id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation DeleteQuestion($id: uuid!) {\n        delete_questions_by_pk(question_id: $id) {\n          question_id\n        }\n      }\n    "): (typeof documents)["\n      mutation DeleteQuestion($id: uuid!) {\n        delete_questions_by_pk(question_id: $id) {\n          question_id\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query GetAllQuestions {\n        questions {\n          question_id\n          question_text\n        }\n      }\n    "): (typeof documents)["\n      query GetAllQuestions {\n        questions {\n          question_id\n          question_text\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation NukeQuestions {\n      delete_questions(where: {}) {\n        affected_rows\n      }\n    }\n  "): (typeof documents)["\n    mutation NukeQuestions {\n      delete_questions(where: {}) {\n        affected_rows\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation NukeQuizzes {\n      delete_quizzes(where: {}) {\n        affected_rows\n      }\n    }\n  "): (typeof documents)["\n    mutation NukeQuizzes {\n      delete_quizzes(where: {}) {\n        affected_rows\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation NukeUsers {\n      delete_users(where: {}) {\n        affected_rows\n      }\n    }\n  "): (typeof documents)["\n    mutation NukeUsers {\n      delete_users(where: {}) {\n        affected_rows\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetQuestions {\n  questions(order_by: [{points: asc}]) {\n    question_id\n    question_text\n    question_type\n    points\n    answer_options\n    correct_answer\n    quiz_id\n  }\n}"): (typeof documents)["query GetQuestions {\n  questions(order_by: [{points: asc}]) {\n    question_id\n    question_text\n    question_type\n    points\n    answer_options\n    correct_answer\n    quiz_id\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;