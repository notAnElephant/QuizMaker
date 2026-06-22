import { ApolloProvider } from "@apollo/client/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import { client } from "./client.ts";
import Editor from "./components/Editor.tsx";
import QuestionView from "./components/QuestionView";
import SavedQuizzes from "./components/SavedQuizzes.tsx";
import Settings from "./components/Settings.tsx";
import Teams from "./components/Teams.tsx";
import { QuizProvider } from "./context/QuizContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <QuizProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/question/:catIndex/:qIndex"
              element={<QuestionView />}
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/quizzes" element={<SavedQuizzes />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </QuizProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
