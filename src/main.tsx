import { ApolloProvider } from "@apollo/client/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import { defaultBackgroundUrl } from "./utility/quizAppearance";
import { client } from "./client.ts";
import Editor from "./components/Editor.tsx";
import Profile from "./components/Profile.tsx";
import QuestionView from "./components/QuestionView";
import QuizPreview from "./components/QuizPreview";
import SavedQuizzes from "./components/SavedQuizzes.tsx";
import Settings from "./components/Settings.tsx";
import Teams from "./components/Teams.tsx";
import { CurrentUserProvider } from "./context/CurrentUserContext.tsx";
import { QuizProvider } from "./context/QuizContext";

document.documentElement.style.setProperty(
  "--default-quiz-background",
  `url("${defaultBackgroundUrl}")`,
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <CurrentUserProvider>
          <QuizProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route
                path="/question/:catIndex/:qIndex"
                element={<QuestionView />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/quizzes" element={<SavedQuizzes />} />
              <Route
                path="/quizzes/new"
                element={<Navigate to="/editor" replace />}
              />
              <Route path="/editor" element={<Editor />} />
              <Route path="/preview" element={<QuizPreview />} />
              <Route
                path="/preview/question/:catIndex/:qIndex"
                element={<QuestionView preview />}
              />
            </Routes>
          </QuizProvider>
        </CurrentUserProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
