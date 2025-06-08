import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from './App';
import './index.css';
import QuestionPage from './pages/QuestionPage.tsx';
import {QuizProvider} from './context/QuizContext';
import SettingsPage from "./pages/SettingsPage.tsx";
import TeamsPage from "./pages/TeamsPage.tsx";
import QuizListPage from "./pages/QuizListPage.tsx";
import EditQuizPage from "./pages/EditQuizPage.tsx";
import {AuthGate} from "./auth/AuthGate.tsx";
import NotFoundPage from './pages/NotFoundPage.tsx';
import AccountPage from "./pages/AccountPage.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthGate>
            <BrowserRouter>
                <QuizProvider>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/question/:catIndex/:qIndex" element={<QuestionPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/teams" element={<TeamsPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/editor" element={<QuizListPage/>} />
                        <Route path="/editor/:id" element={<EditQuizPage/>} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </QuizProvider>
            </BrowserRouter>
        </AuthGate>
    </React.StrictMode>
);
