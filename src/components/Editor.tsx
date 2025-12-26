import { useQuery } from "@apollo/client/react";
import React from "react";
import { GetQuestionsDocument } from "../gql/graphql";

const Editor: React.FC = () => {
  const { loading, error, data } = useQuery(GetQuestionsDocument);

  if (loading) return <p className="p-4">Loading questions...</p>;

  if (error)
    return (
      <div className="p-4 text-red-500">
        <h1 className="text-xl font-bold">GraphQL Error</h1>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions Editor</h1>
      {!data?.questions?.length ? (
        <p>No questions found in the database.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Points</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Content</th>
                <th className="border p-2">Correct Answer</th>
                <th className="border p-2">Options</th>
              </tr>
            </thead>
            <tbody>
              {data.questions.map((q) => (
                <tr key={q.question_id} className="border-b hover:bg-gray-50">
                  <td className="border p-2 text-xs font-mono">
                    {q.question_id}
                  </td>
                  <td className="border p-2">{q.points}</td>
                  <td className="border p-2">{q.question_type}</td>
                  <td className="border p-2">{q.question_text}</td>
                  <td className="border p-2">{q.correct_answer}</td>
                  <td className="border p-2 text-sm">
                    {Array.isArray(q.answer_options)
                      ? q.answer_options.join(", ")
                      : JSON.stringify(q.answer_options)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Editor;
