/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  timestamp: { input: any; output: any; }
  uuid: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['String']['input']>>;
  _eq?: InputMaybe<Array<Scalars['String']['input']>>;
  _gt?: InputMaybe<Array<Scalars['String']['input']>>;
  _gte?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['String']['input']>>;
  _lte?: InputMaybe<Array<Scalars['String']['input']>>;
  _neq?: InputMaybe<Array<Scalars['String']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "answers" */
export type Answers = {
  __typename?: 'answers';
  answer_id: Scalars['uuid']['output'];
  answer_text: Scalars['String']['output'];
  play_id?: Maybe<Scalars['uuid']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "answers" */
export type Answers_Aggregate = {
  __typename?: 'answers_aggregate';
  aggregate?: Maybe<Answers_Aggregate_Fields>;
  nodes: Array<Answers>;
};

/** aggregate fields of "answers" */
export type Answers_Aggregate_Fields = {
  __typename?: 'answers_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Answers_Max_Fields>;
  min?: Maybe<Answers_Min_Fields>;
};


/** aggregate fields of "answers" */
export type Answers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Answers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "answers". All fields are combined with a logical 'AND'. */
export type Answers_Bool_Exp = {
  _and?: InputMaybe<Array<Answers_Bool_Exp>>;
  _not?: InputMaybe<Answers_Bool_Exp>;
  _or?: InputMaybe<Array<Answers_Bool_Exp>>;
  answer_id?: InputMaybe<Uuid_Comparison_Exp>;
  answer_text?: InputMaybe<String_Comparison_Exp>;
  play_id?: InputMaybe<Uuid_Comparison_Exp>;
  question_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "answers" */
export enum Answers_Constraint {
  /** unique or primary key constraint on columns "answer_id" */
  AnswersPkey = 'answers_pkey'
}

/** input type for inserting data into table "answers" */
export type Answers_Insert_Input = {
  answer_id?: InputMaybe<Scalars['uuid']['input']>;
  answer_text?: InputMaybe<Scalars['String']['input']>;
  play_id?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Answers_Max_Fields = {
  __typename?: 'answers_max_fields';
  answer_id?: Maybe<Scalars['uuid']['output']>;
  answer_text?: Maybe<Scalars['String']['output']>;
  play_id?: Maybe<Scalars['uuid']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Answers_Min_Fields = {
  __typename?: 'answers_min_fields';
  answer_id?: Maybe<Scalars['uuid']['output']>;
  answer_text?: Maybe<Scalars['String']['output']>;
  play_id?: Maybe<Scalars['uuid']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "answers" */
export type Answers_Mutation_Response = {
  __typename?: 'answers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Answers>;
};

/** on_conflict condition type for table "answers" */
export type Answers_On_Conflict = {
  constraint: Answers_Constraint;
  update_columns?: Array<Answers_Update_Column>;
  where?: InputMaybe<Answers_Bool_Exp>;
};

/** Ordering options when selecting data from "answers". */
export type Answers_Order_By = {
  answer_id?: InputMaybe<Order_By>;
  answer_text?: InputMaybe<Order_By>;
  play_id?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: answers */
export type Answers_Pk_Columns_Input = {
  answer_id: Scalars['uuid']['input'];
};

/** select columns of table "answers" */
export enum Answers_Select_Column {
  /** column name */
  AnswerId = 'answer_id',
  /** column name */
  AnswerText = 'answer_text',
  /** column name */
  PlayId = 'play_id',
  /** column name */
  QuestionId = 'question_id'
}

/** input type for updating data in table "answers" */
export type Answers_Set_Input = {
  answer_id?: InputMaybe<Scalars['uuid']['input']>;
  answer_text?: InputMaybe<Scalars['String']['input']>;
  play_id?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "answers" */
export type Answers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Answers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Answers_Stream_Cursor_Value_Input = {
  answer_id?: InputMaybe<Scalars['uuid']['input']>;
  answer_text?: InputMaybe<Scalars['String']['input']>;
  play_id?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "answers" */
export enum Answers_Update_Column {
  /** column name */
  AnswerId = 'answer_id',
  /** column name */
  AnswerText = 'answer_text',
  /** column name */
  PlayId = 'play_id',
  /** column name */
  QuestionId = 'question_id'
}

export type Answers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Answers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Answers_Bool_Exp;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "answers" */
  delete_answers?: Maybe<Answers_Mutation_Response>;
  /** delete single row from the table: "answers" */
  delete_answers_by_pk?: Maybe<Answers>;
  /** delete data from the table: "questions" */
  delete_questions?: Maybe<Questions_Mutation_Response>;
  /** delete single row from the table: "questions" */
  delete_questions_by_pk?: Maybe<Questions>;
  /** delete data from the table: "quiz_plays" */
  delete_quiz_plays?: Maybe<Quiz_Plays_Mutation_Response>;
  /** delete single row from the table: "quiz_plays" */
  delete_quiz_plays_by_pk?: Maybe<Quiz_Plays>;
  /** delete data from the table: "quizzes" */
  delete_quizzes?: Maybe<Quizzes_Mutation_Response>;
  /** delete single row from the table: "quizzes" */
  delete_quizzes_by_pk?: Maybe<Quizzes>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "answers" */
  insert_answers?: Maybe<Answers_Mutation_Response>;
  /** insert a single row into the table: "answers" */
  insert_answers_one?: Maybe<Answers>;
  /** insert data into the table: "questions" */
  insert_questions?: Maybe<Questions_Mutation_Response>;
  /** insert a single row into the table: "questions" */
  insert_questions_one?: Maybe<Questions>;
  /** insert data into the table: "quiz_plays" */
  insert_quiz_plays?: Maybe<Quiz_Plays_Mutation_Response>;
  /** insert a single row into the table: "quiz_plays" */
  insert_quiz_plays_one?: Maybe<Quiz_Plays>;
  /** insert data into the table: "quizzes" */
  insert_quizzes?: Maybe<Quizzes_Mutation_Response>;
  /** insert a single row into the table: "quizzes" */
  insert_quizzes_one?: Maybe<Quizzes>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** update data of the table: "answers" */
  update_answers?: Maybe<Answers_Mutation_Response>;
  /** update single row of the table: "answers" */
  update_answers_by_pk?: Maybe<Answers>;
  /** update multiples rows of table: "answers" */
  update_answers_many?: Maybe<Array<Maybe<Answers_Mutation_Response>>>;
  /** update data of the table: "questions" */
  update_questions?: Maybe<Questions_Mutation_Response>;
  /** update single row of the table: "questions" */
  update_questions_by_pk?: Maybe<Questions>;
  /** update multiples rows of table: "questions" */
  update_questions_many?: Maybe<Array<Maybe<Questions_Mutation_Response>>>;
  /** update data of the table: "quiz_plays" */
  update_quiz_plays?: Maybe<Quiz_Plays_Mutation_Response>;
  /** update single row of the table: "quiz_plays" */
  update_quiz_plays_by_pk?: Maybe<Quiz_Plays>;
  /** update multiples rows of table: "quiz_plays" */
  update_quiz_plays_many?: Maybe<Array<Maybe<Quiz_Plays_Mutation_Response>>>;
  /** update data of the table: "quizzes" */
  update_quizzes?: Maybe<Quizzes_Mutation_Response>;
  /** update single row of the table: "quizzes" */
  update_quizzes_by_pk?: Maybe<Quizzes>;
  /** update multiples rows of table: "quizzes" */
  update_quizzes_many?: Maybe<Array<Maybe<Quizzes_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_AnswersArgs = {
  where: Answers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Answers_By_PkArgs = {
  answer_id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_QuestionsArgs = {
  where: Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Questions_By_PkArgs = {
  question_id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Quiz_PlaysArgs = {
  where: Quiz_Plays_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Quiz_Plays_By_PkArgs = {
  play_id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_QuizzesArgs = {
  where: Quizzes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Quizzes_By_PkArgs = {
  quiz_id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  user_id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootInsert_AnswersArgs = {
  objects: Array<Answers_Insert_Input>;
  on_conflict?: InputMaybe<Answers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Answers_OneArgs = {
  object: Answers_Insert_Input;
  on_conflict?: InputMaybe<Answers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_QuestionsArgs = {
  objects: Array<Questions_Insert_Input>;
  on_conflict?: InputMaybe<Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Questions_OneArgs = {
  object: Questions_Insert_Input;
  on_conflict?: InputMaybe<Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Quiz_PlaysArgs = {
  objects: Array<Quiz_Plays_Insert_Input>;
  on_conflict?: InputMaybe<Quiz_Plays_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Quiz_Plays_OneArgs = {
  object: Quiz_Plays_Insert_Input;
  on_conflict?: InputMaybe<Quiz_Plays_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_QuizzesArgs = {
  objects: Array<Quizzes_Insert_Input>;
  on_conflict?: InputMaybe<Quizzes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Quizzes_OneArgs = {
  object: Quizzes_Insert_Input;
  on_conflict?: InputMaybe<Quizzes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_AnswersArgs = {
  _set?: InputMaybe<Answers_Set_Input>;
  where: Answers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Answers_By_PkArgs = {
  _set?: InputMaybe<Answers_Set_Input>;
  pk_columns: Answers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Answers_ManyArgs = {
  updates: Array<Answers_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_QuestionsArgs = {
  _inc?: InputMaybe<Questions_Inc_Input>;
  _set?: InputMaybe<Questions_Set_Input>;
  where: Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Questions_By_PkArgs = {
  _inc?: InputMaybe<Questions_Inc_Input>;
  _set?: InputMaybe<Questions_Set_Input>;
  pk_columns: Questions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Questions_ManyArgs = {
  updates: Array<Questions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Quiz_PlaysArgs = {
  _inc?: InputMaybe<Quiz_Plays_Inc_Input>;
  _set?: InputMaybe<Quiz_Plays_Set_Input>;
  where: Quiz_Plays_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Quiz_Plays_By_PkArgs = {
  _inc?: InputMaybe<Quiz_Plays_Inc_Input>;
  _set?: InputMaybe<Quiz_Plays_Set_Input>;
  pk_columns: Quiz_Plays_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Quiz_Plays_ManyArgs = {
  updates: Array<Quiz_Plays_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_QuizzesArgs = {
  _set?: InputMaybe<Quizzes_Set_Input>;
  where: Quizzes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Quizzes_By_PkArgs = {
  _set?: InputMaybe<Quizzes_Set_Input>;
  pk_columns: Quizzes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Quizzes_ManyArgs = {
  updates: Array<Quizzes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "answers" */
  answers: Array<Answers>;
  /** fetch aggregated fields from the table: "answers" */
  answers_aggregate: Answers_Aggregate;
  /** fetch data from the table: "answers" using primary key columns */
  answers_by_pk?: Maybe<Answers>;
  /** fetch data from the table: "questions" */
  questions: Array<Questions>;
  /** fetch aggregated fields from the table: "questions" */
  questions_aggregate: Questions_Aggregate;
  /** fetch data from the table: "questions" using primary key columns */
  questions_by_pk?: Maybe<Questions>;
  /** fetch data from the table: "quiz_plays" */
  quiz_plays: Array<Quiz_Plays>;
  /** fetch aggregated fields from the table: "quiz_plays" */
  quiz_plays_aggregate: Quiz_Plays_Aggregate;
  /** fetch data from the table: "quiz_plays" using primary key columns */
  quiz_plays_by_pk?: Maybe<Quiz_Plays>;
  /** fetch data from the table: "quizzes" */
  quizzes: Array<Quizzes>;
  /** fetch aggregated fields from the table: "quizzes" */
  quizzes_aggregate: Quizzes_Aggregate;
  /** fetch data from the table: "quizzes" using primary key columns */
  quizzes_by_pk?: Maybe<Quizzes>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Query_RootAnswersArgs = {
  distinct_on?: InputMaybe<Array<Answers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Answers_Order_By>>;
  where?: InputMaybe<Answers_Bool_Exp>;
};


export type Query_RootAnswers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Answers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Answers_Order_By>>;
  where?: InputMaybe<Answers_Bool_Exp>;
};


export type Query_RootAnswers_By_PkArgs = {
  answer_id: Scalars['uuid']['input'];
};


export type Query_RootQuestionsArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Query_RootQuestions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Query_RootQuestions_By_PkArgs = {
  question_id: Scalars['uuid']['input'];
};


export type Query_RootQuiz_PlaysArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Plays_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Plays_Order_By>>;
  where?: InputMaybe<Quiz_Plays_Bool_Exp>;
};


export type Query_RootQuiz_Plays_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Plays_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Plays_Order_By>>;
  where?: InputMaybe<Quiz_Plays_Bool_Exp>;
};


export type Query_RootQuiz_Plays_By_PkArgs = {
  play_id: Scalars['uuid']['input'];
};


export type Query_RootQuizzesArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Query_RootQuizzes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Query_RootQuizzes_By_PkArgs = {
  quiz_id: Scalars['uuid']['input'];
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_By_PkArgs = {
  user_id: Scalars['uuid']['input'];
};

/** columns and relationships of "questions" */
export type Questions = {
  __typename?: 'questions';
  answer_options?: Maybe<Array<Scalars['String']['output']>>;
  correct_answer?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Scalars['Int']['output']>;
  question_id: Scalars['uuid']['output'];
  question_text: Scalars['String']['output'];
  question_type: Scalars['String']['output'];
  quiz_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "questions" */
export type Questions_Aggregate = {
  __typename?: 'questions_aggregate';
  aggregate?: Maybe<Questions_Aggregate_Fields>;
  nodes: Array<Questions>;
};

/** aggregate fields of "questions" */
export type Questions_Aggregate_Fields = {
  __typename?: 'questions_aggregate_fields';
  avg?: Maybe<Questions_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Questions_Max_Fields>;
  min?: Maybe<Questions_Min_Fields>;
  stddev?: Maybe<Questions_Stddev_Fields>;
  stddev_pop?: Maybe<Questions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Questions_Stddev_Samp_Fields>;
  sum?: Maybe<Questions_Sum_Fields>;
  var_pop?: Maybe<Questions_Var_Pop_Fields>;
  var_samp?: Maybe<Questions_Var_Samp_Fields>;
  variance?: Maybe<Questions_Variance_Fields>;
};


/** aggregate fields of "questions" */
export type Questions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Questions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Questions_Avg_Fields = {
  __typename?: 'questions_avg_fields';
  points?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "questions". All fields are combined with a logical 'AND'. */
export type Questions_Bool_Exp = {
  _and?: InputMaybe<Array<Questions_Bool_Exp>>;
  _not?: InputMaybe<Questions_Bool_Exp>;
  _or?: InputMaybe<Array<Questions_Bool_Exp>>;
  answer_options?: InputMaybe<String_Array_Comparison_Exp>;
  correct_answer?: InputMaybe<String_Comparison_Exp>;
  points?: InputMaybe<Int_Comparison_Exp>;
  question_id?: InputMaybe<Uuid_Comparison_Exp>;
  question_text?: InputMaybe<String_Comparison_Exp>;
  question_type?: InputMaybe<String_Comparison_Exp>;
  quiz_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "questions" */
export enum Questions_Constraint {
  /** unique or primary key constraint on columns "question_id" */
  QuestionsPkey = 'questions_pkey'
}

/** input type for incrementing numeric columns in table "questions" */
export type Questions_Inc_Input = {
  points?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "questions" */
export type Questions_Insert_Input = {
  answer_options?: InputMaybe<Array<Scalars['String']['input']>>;
  correct_answer?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Int']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  question_text?: InputMaybe<Scalars['String']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Questions_Max_Fields = {
  __typename?: 'questions_max_fields';
  answer_options?: Maybe<Array<Scalars['String']['output']>>;
  correct_answer?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Scalars['Int']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
  question_text?: Maybe<Scalars['String']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  quiz_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Questions_Min_Fields = {
  __typename?: 'questions_min_fields';
  answer_options?: Maybe<Array<Scalars['String']['output']>>;
  correct_answer?: Maybe<Scalars['String']['output']>;
  points?: Maybe<Scalars['Int']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
  question_text?: Maybe<Scalars['String']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  quiz_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "questions" */
export type Questions_Mutation_Response = {
  __typename?: 'questions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Questions>;
};

/** on_conflict condition type for table "questions" */
export type Questions_On_Conflict = {
  constraint: Questions_Constraint;
  update_columns?: Array<Questions_Update_Column>;
  where?: InputMaybe<Questions_Bool_Exp>;
};

/** Ordering options when selecting data from "questions". */
export type Questions_Order_By = {
  answer_options?: InputMaybe<Order_By>;
  correct_answer?: InputMaybe<Order_By>;
  points?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  question_text?: InputMaybe<Order_By>;
  question_type?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: questions */
export type Questions_Pk_Columns_Input = {
  question_id: Scalars['uuid']['input'];
};

/** select columns of table "questions" */
export enum Questions_Select_Column {
  /** column name */
  AnswerOptions = 'answer_options',
  /** column name */
  CorrectAnswer = 'correct_answer',
  /** column name */
  Points = 'points',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  QuestionText = 'question_text',
  /** column name */
  QuestionType = 'question_type',
  /** column name */
  QuizId = 'quiz_id'
}

/** input type for updating data in table "questions" */
export type Questions_Set_Input = {
  answer_options?: InputMaybe<Array<Scalars['String']['input']>>;
  correct_answer?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Int']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  question_text?: InputMaybe<Scalars['String']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Questions_Stddev_Fields = {
  __typename?: 'questions_stddev_fields';
  points?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Questions_Stddev_Pop_Fields = {
  __typename?: 'questions_stddev_pop_fields';
  points?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Questions_Stddev_Samp_Fields = {
  __typename?: 'questions_stddev_samp_fields';
  points?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "questions" */
export type Questions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Questions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Questions_Stream_Cursor_Value_Input = {
  answer_options?: InputMaybe<Array<Scalars['String']['input']>>;
  correct_answer?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Int']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  question_text?: InputMaybe<Scalars['String']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Questions_Sum_Fields = {
  __typename?: 'questions_sum_fields';
  points?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "questions" */
export enum Questions_Update_Column {
  /** column name */
  AnswerOptions = 'answer_options',
  /** column name */
  CorrectAnswer = 'correct_answer',
  /** column name */
  Points = 'points',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  QuestionText = 'question_text',
  /** column name */
  QuestionType = 'question_type',
  /** column name */
  QuizId = 'quiz_id'
}

export type Questions_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Questions_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Questions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Questions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Questions_Var_Pop_Fields = {
  __typename?: 'questions_var_pop_fields';
  points?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Questions_Var_Samp_Fields = {
  __typename?: 'questions_var_samp_fields';
  points?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Questions_Variance_Fields = {
  __typename?: 'questions_variance_fields';
  points?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "quiz_plays" */
export type Quiz_Plays = {
  __typename?: 'quiz_plays';
  play_id: Scalars['uuid']['output'];
  play_time: Scalars['timestamp']['output'];
  quiz_id?: Maybe<Scalars['uuid']['output']>;
  score?: Maybe<Scalars['Int']['output']>;
  team_name?: Maybe<Scalars['String']['output']>;
  team_score?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "quiz_plays" */
export type Quiz_Plays_Aggregate = {
  __typename?: 'quiz_plays_aggregate';
  aggregate?: Maybe<Quiz_Plays_Aggregate_Fields>;
  nodes: Array<Quiz_Plays>;
};

/** aggregate fields of "quiz_plays" */
export type Quiz_Plays_Aggregate_Fields = {
  __typename?: 'quiz_plays_aggregate_fields';
  avg?: Maybe<Quiz_Plays_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Quiz_Plays_Max_Fields>;
  min?: Maybe<Quiz_Plays_Min_Fields>;
  stddev?: Maybe<Quiz_Plays_Stddev_Fields>;
  stddev_pop?: Maybe<Quiz_Plays_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Quiz_Plays_Stddev_Samp_Fields>;
  sum?: Maybe<Quiz_Plays_Sum_Fields>;
  var_pop?: Maybe<Quiz_Plays_Var_Pop_Fields>;
  var_samp?: Maybe<Quiz_Plays_Var_Samp_Fields>;
  variance?: Maybe<Quiz_Plays_Variance_Fields>;
};


/** aggregate fields of "quiz_plays" */
export type Quiz_Plays_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Quiz_Plays_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Quiz_Plays_Avg_Fields = {
  __typename?: 'quiz_plays_avg_fields';
  score?: Maybe<Scalars['Float']['output']>;
  team_score?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "quiz_plays". All fields are combined with a logical 'AND'. */
export type Quiz_Plays_Bool_Exp = {
  _and?: InputMaybe<Array<Quiz_Plays_Bool_Exp>>;
  _not?: InputMaybe<Quiz_Plays_Bool_Exp>;
  _or?: InputMaybe<Array<Quiz_Plays_Bool_Exp>>;
  play_id?: InputMaybe<Uuid_Comparison_Exp>;
  play_time?: InputMaybe<Timestamp_Comparison_Exp>;
  quiz_id?: InputMaybe<Uuid_Comparison_Exp>;
  score?: InputMaybe<Int_Comparison_Exp>;
  team_name?: InputMaybe<String_Comparison_Exp>;
  team_score?: InputMaybe<Int_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "quiz_plays" */
export enum Quiz_Plays_Constraint {
  /** unique or primary key constraint on columns "play_id" */
  QuizPlaysPkey = 'quiz_plays_pkey'
}

/** input type for incrementing numeric columns in table "quiz_plays" */
export type Quiz_Plays_Inc_Input = {
  score?: InputMaybe<Scalars['Int']['input']>;
  team_score?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "quiz_plays" */
export type Quiz_Plays_Insert_Input = {
  play_id?: InputMaybe<Scalars['uuid']['input']>;
  play_time?: InputMaybe<Scalars['timestamp']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
  team_name?: InputMaybe<Scalars['String']['input']>;
  team_score?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Quiz_Plays_Max_Fields = {
  __typename?: 'quiz_plays_max_fields';
  play_id?: Maybe<Scalars['uuid']['output']>;
  play_time?: Maybe<Scalars['timestamp']['output']>;
  quiz_id?: Maybe<Scalars['uuid']['output']>;
  score?: Maybe<Scalars['Int']['output']>;
  team_name?: Maybe<Scalars['String']['output']>;
  team_score?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Quiz_Plays_Min_Fields = {
  __typename?: 'quiz_plays_min_fields';
  play_id?: Maybe<Scalars['uuid']['output']>;
  play_time?: Maybe<Scalars['timestamp']['output']>;
  quiz_id?: Maybe<Scalars['uuid']['output']>;
  score?: Maybe<Scalars['Int']['output']>;
  team_name?: Maybe<Scalars['String']['output']>;
  team_score?: Maybe<Scalars['Int']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "quiz_plays" */
export type Quiz_Plays_Mutation_Response = {
  __typename?: 'quiz_plays_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Quiz_Plays>;
};

/** on_conflict condition type for table "quiz_plays" */
export type Quiz_Plays_On_Conflict = {
  constraint: Quiz_Plays_Constraint;
  update_columns?: Array<Quiz_Plays_Update_Column>;
  where?: InputMaybe<Quiz_Plays_Bool_Exp>;
};

/** Ordering options when selecting data from "quiz_plays". */
export type Quiz_Plays_Order_By = {
  play_id?: InputMaybe<Order_By>;
  play_time?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  team_name?: InputMaybe<Order_By>;
  team_score?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: quiz_plays */
export type Quiz_Plays_Pk_Columns_Input = {
  play_id: Scalars['uuid']['input'];
};

/** select columns of table "quiz_plays" */
export enum Quiz_Plays_Select_Column {
  /** column name */
  PlayId = 'play_id',
  /** column name */
  PlayTime = 'play_time',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  Score = 'score',
  /** column name */
  TeamName = 'team_name',
  /** column name */
  TeamScore = 'team_score',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "quiz_plays" */
export type Quiz_Plays_Set_Input = {
  play_id?: InputMaybe<Scalars['uuid']['input']>;
  play_time?: InputMaybe<Scalars['timestamp']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
  team_name?: InputMaybe<Scalars['String']['input']>;
  team_score?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Quiz_Plays_Stddev_Fields = {
  __typename?: 'quiz_plays_stddev_fields';
  score?: Maybe<Scalars['Float']['output']>;
  team_score?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Quiz_Plays_Stddev_Pop_Fields = {
  __typename?: 'quiz_plays_stddev_pop_fields';
  score?: Maybe<Scalars['Float']['output']>;
  team_score?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Quiz_Plays_Stddev_Samp_Fields = {
  __typename?: 'quiz_plays_stddev_samp_fields';
  score?: Maybe<Scalars['Float']['output']>;
  team_score?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "quiz_plays" */
export type Quiz_Plays_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Quiz_Plays_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Quiz_Plays_Stream_Cursor_Value_Input = {
  play_id?: InputMaybe<Scalars['uuid']['input']>;
  play_time?: InputMaybe<Scalars['timestamp']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
  team_name?: InputMaybe<Scalars['String']['input']>;
  team_score?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Quiz_Plays_Sum_Fields = {
  __typename?: 'quiz_plays_sum_fields';
  score?: Maybe<Scalars['Int']['output']>;
  team_score?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "quiz_plays" */
export enum Quiz_Plays_Update_Column {
  /** column name */
  PlayId = 'play_id',
  /** column name */
  PlayTime = 'play_time',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  Score = 'score',
  /** column name */
  TeamName = 'team_name',
  /** column name */
  TeamScore = 'team_score',
  /** column name */
  UserId = 'user_id'
}

export type Quiz_Plays_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Quiz_Plays_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Quiz_Plays_Set_Input>;
  /** filter the rows which have to be updated */
  where: Quiz_Plays_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Quiz_Plays_Var_Pop_Fields = {
  __typename?: 'quiz_plays_var_pop_fields';
  score?: Maybe<Scalars['Float']['output']>;
  team_score?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Quiz_Plays_Var_Samp_Fields = {
  __typename?: 'quiz_plays_var_samp_fields';
  score?: Maybe<Scalars['Float']['output']>;
  team_score?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Quiz_Plays_Variance_Fields = {
  __typename?: 'quiz_plays_variance_fields';
  score?: Maybe<Scalars['Float']['output']>;
  team_score?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "quizzes" */
export type Quizzes = {
  __typename?: 'quizzes';
  created_at: Scalars['timestamp']['output'];
  description?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['uuid']['output']>;
  quiz_id: Scalars['uuid']['output'];
  shared_user_ids?: Maybe<Array<Scalars['uuid']['output']>>;
  title: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** aggregated selection of "quizzes" */
export type Quizzes_Aggregate = {
  __typename?: 'quizzes_aggregate';
  aggregate?: Maybe<Quizzes_Aggregate_Fields>;
  nodes: Array<Quizzes>;
};

/** aggregate fields of "quizzes" */
export type Quizzes_Aggregate_Fields = {
  __typename?: 'quizzes_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Quizzes_Max_Fields>;
  min?: Maybe<Quizzes_Min_Fields>;
};


/** aggregate fields of "quizzes" */
export type Quizzes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Quizzes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "quizzes". All fields are combined with a logical 'AND'. */
export type Quizzes_Bool_Exp = {
  _and?: InputMaybe<Array<Quizzes_Bool_Exp>>;
  _not?: InputMaybe<Quizzes_Bool_Exp>;
  _or?: InputMaybe<Array<Quizzes_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  owner_id?: InputMaybe<Uuid_Comparison_Exp>;
  quiz_id?: InputMaybe<Uuid_Comparison_Exp>;
  shared_user_ids?: InputMaybe<Uuid_Array_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "quizzes" */
export enum Quizzes_Constraint {
  /** unique or primary key constraint on columns "quiz_id" */
  QuizzesPkey = 'quizzes_pkey'
}

/** input type for inserting data into table "quizzes" */
export type Quizzes_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['uuid']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
  shared_user_ids?: InputMaybe<Array<Scalars['uuid']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Quizzes_Max_Fields = {
  __typename?: 'quizzes_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['uuid']['output']>;
  quiz_id?: Maybe<Scalars['uuid']['output']>;
  shared_user_ids?: Maybe<Array<Scalars['uuid']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** aggregate min on columns */
export type Quizzes_Min_Fields = {
  __typename?: 'quizzes_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['uuid']['output']>;
  quiz_id?: Maybe<Scalars['uuid']['output']>;
  shared_user_ids?: Maybe<Array<Scalars['uuid']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** response of any mutation on the table "quizzes" */
export type Quizzes_Mutation_Response = {
  __typename?: 'quizzes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Quizzes>;
};

/** on_conflict condition type for table "quizzes" */
export type Quizzes_On_Conflict = {
  constraint: Quizzes_Constraint;
  update_columns?: Array<Quizzes_Update_Column>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};

/** Ordering options when selecting data from "quizzes". */
export type Quizzes_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  shared_user_ids?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: quizzes */
export type Quizzes_Pk_Columns_Input = {
  quiz_id: Scalars['uuid']['input'];
};

/** select columns of table "quizzes" */
export enum Quizzes_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  SharedUserIds = 'shared_user_ids',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "quizzes" */
export type Quizzes_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['uuid']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
  shared_user_ids?: InputMaybe<Array<Scalars['uuid']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** Streaming cursor of the table "quizzes" */
export type Quizzes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Quizzes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Quizzes_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['uuid']['input']>;
  quiz_id?: InputMaybe<Scalars['uuid']['input']>;
  shared_user_ids?: InputMaybe<Array<Scalars['uuid']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** update columns of table "quizzes" */
export enum Quizzes_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  SharedUserIds = 'shared_user_ids',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Quizzes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Quizzes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Quizzes_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "answers" */
  answers: Array<Answers>;
  /** fetch aggregated fields from the table: "answers" */
  answers_aggregate: Answers_Aggregate;
  /** fetch data from the table: "answers" using primary key columns */
  answers_by_pk?: Maybe<Answers>;
  /** fetch data from the table in a streaming manner: "answers" */
  answers_stream: Array<Answers>;
  /** fetch data from the table: "questions" */
  questions: Array<Questions>;
  /** fetch aggregated fields from the table: "questions" */
  questions_aggregate: Questions_Aggregate;
  /** fetch data from the table: "questions" using primary key columns */
  questions_by_pk?: Maybe<Questions>;
  /** fetch data from the table in a streaming manner: "questions" */
  questions_stream: Array<Questions>;
  /** fetch data from the table: "quiz_plays" */
  quiz_plays: Array<Quiz_Plays>;
  /** fetch aggregated fields from the table: "quiz_plays" */
  quiz_plays_aggregate: Quiz_Plays_Aggregate;
  /** fetch data from the table: "quiz_plays" using primary key columns */
  quiz_plays_by_pk?: Maybe<Quiz_Plays>;
  /** fetch data from the table in a streaming manner: "quiz_plays" */
  quiz_plays_stream: Array<Quiz_Plays>;
  /** fetch data from the table: "quizzes" */
  quizzes: Array<Quizzes>;
  /** fetch aggregated fields from the table: "quizzes" */
  quizzes_aggregate: Quizzes_Aggregate;
  /** fetch data from the table: "quizzes" using primary key columns */
  quizzes_by_pk?: Maybe<Quizzes>;
  /** fetch data from the table in a streaming manner: "quizzes" */
  quizzes_stream: Array<Quizzes>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
};


export type Subscription_RootAnswersArgs = {
  distinct_on?: InputMaybe<Array<Answers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Answers_Order_By>>;
  where?: InputMaybe<Answers_Bool_Exp>;
};


export type Subscription_RootAnswers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Answers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Answers_Order_By>>;
  where?: InputMaybe<Answers_Bool_Exp>;
};


export type Subscription_RootAnswers_By_PkArgs = {
  answer_id: Scalars['uuid']['input'];
};


export type Subscription_RootAnswers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Answers_Stream_Cursor_Input>>;
  where?: InputMaybe<Answers_Bool_Exp>;
};


export type Subscription_RootQuestionsArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootQuestions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootQuestions_By_PkArgs = {
  question_id: Scalars['uuid']['input'];
};


export type Subscription_RootQuestions_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Questions_Stream_Cursor_Input>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootQuiz_PlaysArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Plays_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Plays_Order_By>>;
  where?: InputMaybe<Quiz_Plays_Bool_Exp>;
};


export type Subscription_RootQuiz_Plays_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Plays_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Plays_Order_By>>;
  where?: InputMaybe<Quiz_Plays_Bool_Exp>;
};


export type Subscription_RootQuiz_Plays_By_PkArgs = {
  play_id: Scalars['uuid']['input'];
};


export type Subscription_RootQuiz_Plays_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Quiz_Plays_Stream_Cursor_Input>>;
  where?: InputMaybe<Quiz_Plays_Bool_Exp>;
};


export type Subscription_RootQuizzesArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Subscription_RootQuizzes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Subscription_RootQuizzes_By_PkArgs = {
  quiz_id: Scalars['uuid']['input'];
};


export type Subscription_RootQuizzes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Quizzes_Stream_Cursor_Input>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_By_PkArgs = {
  user_id: Scalars['uuid']['input'];
};


export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  created_at: Scalars['timestamp']['output'];
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  display_name?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "user_id" */
  UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  created_at?: InputMaybe<Order_By>;
  display_name?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  user_id: Scalars['uuid']['input'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DisplayName = 'display_name',
  /** column name */
  Email = 'email',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DisplayName = 'display_name',
  /** column name */
  Email = 'email',
  /** column name */
  UserId = 'user_id'
}

export type Users_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _eq?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _gt?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _gte?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['uuid']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _lte?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _neq?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['uuid']['input']>>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', user_id: any }> };

export type CreateUserMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'mutation_root', insert_users_one?: { __typename?: 'users', user_id: any } | null };

export type CreateQuizMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  title: Scalars['String']['input'];
  owner_id: Scalars['uuid']['input'];
}>;


export type CreateQuizMutation = { __typename?: 'mutation_root', insert_quizzes_one?: { __typename?: 'quizzes', quiz_id: any } | null };

export type CreateQuestionMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  text: Scalars['String']['input'];
  type: Scalars['String']['input'];
  points: Scalars['Int']['input'];
  quiz_id: Scalars['uuid']['input'];
  options?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateQuestionMutation = { __typename?: 'mutation_root', insert_questions_one?: { __typename?: 'questions', question_id: any } | null };

export type DeleteQuestionMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteQuestionMutation = { __typename?: 'mutation_root', delete_questions_by_pk?: { __typename?: 'questions', question_id: any } | null };

export type GetAllQuestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllQuestionsQuery = { __typename?: 'query_root', questions: Array<{ __typename?: 'questions', question_id: any, question_text: string }> };

export type NukeQuestionsMutationVariables = Exact<{ [key: string]: never; }>;


export type NukeQuestionsMutation = { __typename?: 'mutation_root', delete_questions?: { __typename?: 'questions_mutation_response', affected_rows: number } | null };

export type NukeQuizzesMutationVariables = Exact<{ [key: string]: never; }>;


export type NukeQuizzesMutation = { __typename?: 'mutation_root', delete_quizzes?: { __typename?: 'quizzes_mutation_response', affected_rows: number } | null };

export type NukeUsersMutationVariables = Exact<{ [key: string]: never; }>;


export type NukeUsersMutation = { __typename?: 'mutation_root', delete_users?: { __typename?: 'users_mutation_response', affected_rows: number } | null };

export type GetQuestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetQuestionsQuery = { __typename?: 'query_root', questions: Array<{ __typename?: 'questions', question_id: any, question_text: string, question_type: string, points?: number | null, answer_options?: Array<string> | null, correct_answer?: string | null, quiz_id?: any | null }> };


export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_users_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"display_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_id"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const CreateQuizDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateQuiz"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_quizzes_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"quiz_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"owner_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quiz_id"}}]}}]}}]} as unknown as DocumentNode<CreateQuizMutation, CreateQuizMutationVariables>;
export const CreateQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"points"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quiz_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_questions_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"question_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"question_text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"question_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"points"},"value":{"kind":"Variable","name":{"kind":"Name","value":"points"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"quiz_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quiz_id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"answer_options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question_id"}}]}}]}}]} as unknown as DocumentNode<CreateQuestionMutation, CreateQuestionMutationVariables>;
export const DeleteQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_questions_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"question_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question_id"}}]}}]}}]} as unknown as DocumentNode<DeleteQuestionMutation, DeleteQuestionMutationVariables>;
export const GetAllQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"question_text"}}]}}]}}]} as unknown as DocumentNode<GetAllQuestionsQuery, GetAllQuestionsQueryVariables>;
export const NukeQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NukeQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_questions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<NukeQuestionsMutation, NukeQuestionsMutationVariables>;
export const NukeQuizzesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NukeQuizzes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_quizzes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<NukeQuizzesMutation, NukeQuizzesMutationVariables>;
export const NukeUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NukeUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<NukeUsersMutation, NukeUsersMutationVariables>;
export const GetQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"points"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"question_text"}},{"kind":"Field","name":{"kind":"Name","value":"question_type"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"answer_options"}},{"kind":"Field","name":{"kind":"Name","value":"correct_answer"}},{"kind":"Field","name":{"kind":"Name","value":"quiz_id"}}]}}]}}]} as unknown as DocumentNode<GetQuestionsQuery, GetQuestionsQueryVariables>;