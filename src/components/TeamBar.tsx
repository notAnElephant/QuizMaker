import { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import ConfettiExplosion from 'react-confetti-explosion';

type TeamBarProps = {
    mode: 'board' | 'question';
    questionPoints?: number;
};

export default function TeamBar({ mode, questionPoints = 0 }: TeamBarProps) {
    const { teams, setTeams } = useQuiz();
    const [confetti, setConfetti] = useState<boolean[]>(Array(teams.length).fill(false));

    if (teams.length === 0) return null;

    const updatePoints = (index: number, delta: number) => {
        if (delta > 0) {
            console.log("yay confetties");
            setConfetti((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
            });
        }

        setTeams((prev) =>
            prev.map((team, i) =>
                i === index ? { ...team, points: (team.points || 0) + delta } : team
            )
        );
    };

    const hideConfetti = (index: number) => () => {
        setConfetti((prev) => {
            const updated = [...prev];
            updated[index] = false;
            return updated;
        });
    }

    return (
        <div className="w-full p-4 flex gap-4 justify-center flex-wrap">
            {teams.map((team, i) => (
                <div
                    key={i}
                    className="relative px-4 py-2 rounded-xl shadow flex items-center gap-3 w-70"
                    style={{ backgroundColor: team.color, color: '#fff' }}
                >
                    {confetti[i] && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                            <ConfettiExplosion duration={1500} onComplete={hideConfetti(i)}/>
                        </div>
                    )}

                    <span className="font-bold">{team.name}</span>
                    <span className="text-sm">({team.points || 0} pont)</span>

                    {mode === 'question' && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updatePoints(i, questionPoints)}
                                className="bg-white text-black px-2 rounded font-bold"
                            >
                                +
                            </button>
                            <button
                                onClick={() => updatePoints(i, -questionPoints)}
                                className="bg-white text-black px-2 rounded font-bold"
                            >
                                –
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
