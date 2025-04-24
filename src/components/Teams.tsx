import {useNavigate} from 'react-router-dom';
import {useQuiz} from '../context/QuizContext';
import {useRef, useState} from 'react';
import {FaArrowLeft, FaPen, FaTrash} from "react-icons/fa";

export default function Teams() {
    const navigate = useNavigate();
    const {teams, setTeams} = useQuiz();

    const [name, setName] = useState('');
    const [members, setMembers] = useState('');
    const [color, setColor] = useState('#3498db');

    const nameInputRef = useRef<HTMLInputElement>(null);

    const addTeam = () => {
        if (!name.trim()) return;

        setTeams(prev => [
            ...prev,
            {
                name: name.trim(),
                members: members.split(',').map(m => m.trim()).filter(Boolean),
                color,
                points: 0
            }
        ]);

        setName('');
        setMembers('');
        setColor('#3498db');

        nameInputRef.current?.focus();
    };

    //TODO editing is clumsy

    return (
        <div className="min-h-screen flex flex-col items-center text-black p-8 gap-6">
            <h1 className="text-3xl font-display">Csapatok</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addTeam();
                }}
                className="bg-white p-6 rounded-xl shadow max-w-md w-full flex flex-col gap-4"
            >
                <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Csapat neve"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="border rounded p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Tagok vesszővel elválasztva"
                    value={members}
                    onChange={e => setMembers(e.target.value)}
                    className="border rounded p-2 w-full"
                />
                <label className="flex items-center gap-3">
                    <span>Szín:</span>
                    <input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                    />
                </label>
                <button
                    onClick={addTeam}
                    className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
                >
                    Csapat hozzáadása
                </button>
            </form>

            <div className="w-full max-w-md max-h-75 overflow-y-auto bg-white rounded shadow">
                {teams.map((team, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-3 border-b last:border-none">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{backgroundColor: team.color}}
                        />

                        <div className="flex-1">
                            <div className="font-bold">{team.name}</div>
                            <div className="text-sm text-gray-600">{team.members.join(', ')}</div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setName(team.name);
                                    setMembers(team.members.join(', '));
                                    setColor(team.color);
                                    setTeams(prev => prev.filter((_, idx) => idx !== i));
                                }}
                                title="Szerkesztés"
                            >
                                <FaPen className="text-blue-600 hover:text-blue-800" size={18}/>
                            </button>

                            <button
                                onClick={() => {
                                    if (confirm(`Tényleg törlöd a(z) "${team.name}" csapatot?`)) {
                                        setTeams(prev => prev.filter((_, idx) => idx !== i));
                                    }
                                }}
                                title="Törlés"
                            >
                                <FaTrash className="text-red-600 hover:text-red-800" size={18}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            <button
                onClick={() => navigate('/')}
                className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
                aria-label="Back"
            >
                <FaArrowLeft size={20}/>
            </button>
        </div>
    );
}
