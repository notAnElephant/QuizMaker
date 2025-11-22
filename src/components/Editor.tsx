import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React from "react";

const GET_QUESTIONS = gql`
  query GetQuestions {
    __typename

    #    query MyQuery {
    answers {
      playId
      questionId
    }
    #    }
  }
`;

const Editor: React.FC = () => {
  const { loading, error, data } = useQuery(GET_QUESTIONS);
  console.log({ data });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {/*{data?.questions.map((question: any) => (*/}
        {/*  <li key={question.questionId}>*/}
        {/*    <p>{question.questionText}</p>*/}
        {/*  </li>*/}
        {/*))}*/}
      </ul>
    </div>
  );
};

export default Editor;
