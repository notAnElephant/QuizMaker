import { ApolloProvider } from "@apollo/client/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";
import { defaultBackgroundUrl } from "./utility/quizAppearance";
import { client } from "./client.ts";
import { ConfirmDialogProvider } from "./components/ConfirmDialogProvider";
import Editor from "./components/Editor.tsx";
import Profile from "./components/Profile.tsx";
import QuestionView from "./components/QuestionView";
import QuizPreview from "./components/QuizPreview";
import RequireLogin from "./components/RequireLogin";
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
            <ConfirmDialogProvider>
              <Toaster
                closeButton
                position="top-right"
                richColors
                toastOptions={{
                  style: {
                    background: "#fff8e7",
                    border: "2px solid #24211c",
                    color: "#24211c",
                    boxShadow: "0 4px 0 #24211c",
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<App />} />
                <Route
                  path="/question/:catIndex/:qIndex"
                  element={<QuestionView />}
                />
                <Route
                  path="/settings"
                  element={
                    <RequireLogin>
                      <Settings />
                    </RequireLogin>
                  }
                />
                <Route
                  path="/teams"
                  element={
                    <RequireLogin>
                      <Teams />
                    </RequireLogin>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireLogin>
                      <Profile />
                    </RequireLogin>
                  }
                />
                <Route
                  path="/quizzes"
                  element={
                    <RequireLogin>
                      <SavedQuizzes />
                    </RequireLogin>
                  }
                />
                <Route
                  path="/quizzes/new"
                  element={<Navigate to="/editor" replace />}
                />
                <Route
                  path="/editor"
                  element={
                    <RequireLogin>
                      <Editor />
                    </RequireLogin>
                  }
                />
                <Route
                  path="/preview"
                  element={
                    <RequireLogin>
                      <QuizPreview />
                    </RequireLogin>
                  }
                />
                <Route
                  path="/preview/question/:catIndex/:qIndex"
                  element={
                    <RequireLogin>
                      <QuestionView preview />
                    </RequireLogin>
                  }
                />
              </Routes>
            </ConfirmDialogProvider>
          </QuizProvider>
        </CurrentUserProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
