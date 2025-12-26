import { useMutation, useQuery } from "@apollo/client/react";
import React, { useState } from "react";
import questionsData from "../data/questions.json";
import { gql } from "../gql";

// Queries and Mutations
const GET_USERS = gql(`
  query GetUsers {
    users(limit: 1) {
      user_id
    }
  }
`);

const CREATE_USER = gql(`
  mutation CreateUser($name: String!) {
    insert_users_one(object: {display_name: $name}) {
      user_id
    }
  }
`);

const CREATE_QUIZ = gql(`
  mutation CreateQuiz($title: String!, $owner_id: uuid!) {
    insert_quizzes_one(object: {title: $title, owner_id: $owner_id}) {
      quiz_id
    }
  }
`);

const CREATE_QUESTION = gql(`
  mutation CreateQuestion(
    $text: String!, 
    $type: String!, 
    $points: Int!, 
    $quiz_id: uuid!, 
    $options: [String!]
  ) {
    insert_questions_one(object: {
      question_text: $text, 
      question_type: $type, 
      points: $points, 
      quiz_id: $quiz_id, 
      answer_options: $options
    }) {
      question_id
    }
  }
`);

const Seeder: React.FC = () => {
  const { data: userData } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [createQuiz] = useMutation(CREATE_QUIZ);
  const [createQuestion] = useMutation(CREATE_QUESTION);

  const [status, setStatus] = useState<string>("Ready");
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setStatus("Starting seed...");

    try {
      // 1. Get or Create User
      let userId = userData?.users[0]?.user_id;

      if (!userId) {
        setStatus("Creating default user...");
        const res = await createUser({ variables: { name: "Admin" } });
        userId = res.data?.insert_users_one?.user_id;
      }

      if (!userId) throw new Error("Could not get or create user");

      // 2. Loop Categories and Create Quizzes
      for (const category of questionsData) {
        setStatus(`Creating quiz for category: ${category.category}...`);

        const quizRes = await createQuiz({
          variables: {
            title: category.category,
            owner_id: userId,
          },
        });

        const quizId = quizRes.data?.insert_quizzes_one?.quiz_id;

        if (!quizId) {
          console.error(`Failed to create quiz for ${category.category}`);
          continue;
        }

        // 3. Loop Questions
        for (const q of category.questions) {
          // Handle source by appending to text if present
          const text = (q as any).source
            ? `${q.content} [SOURCE: ${(q as any).source}]`
            : q.content;

          await createQuestion({
            variables: {
              text: text,
              type: q.type,
              points: q.points,
              quiz_id: quizId,
              options: (q as any).list || [], // Handle optional list
            },
          });
        }
      }

      setStatus("Seeding complete! Please refresh the page.");
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50 mb-8">
      <h2 className="font-bold text-lg mb-2">Database Seeder</h2>
      <p className="mb-4 text-sm text-gray-600">
        Status: <span className="font-mono">{status}</span>
      </p>
      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Seeding..." : "Seed Database from questions.json"}
      </button>
    </div>
  );
};

export default Seeder;
