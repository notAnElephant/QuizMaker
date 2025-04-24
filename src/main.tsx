import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from './App';
import './index.css';
import QuestionView from './components/QuestionView';
import {QuizProvider} from './context/QuizContext';
import Settings from "./components/Settings.tsx";
import Teams from "./components/Teams.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <QuizProvider>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/question/:catIndex/:qIndex" element={<QuestionView/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/teams" element={<Teams/>}/>
                </Routes>
            </QuizProvider>
        </BrowserRouter>
    </React.StrictMode>
);
