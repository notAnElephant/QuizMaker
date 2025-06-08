import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {FaArrowLeft} from "react-icons/fa";

export default function AccountPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(u => setUser(u));
        return () => unsub();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/'); // after sign out, back to home
    };

    if (!user) return null; // should never happen because of AuthGate, but safety

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-3xl font-bold mb-8 font-display">Fiók</h1>

            <div className="bg-white rounded-xl shadow p-6 max-w-md w-full flex flex-col items-center gap-4">
                <img
                    src={user.photoURL || ''}
                    alt="Profilkép"
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div className="text-xl font-semibold">{user.displayName}</div>
                <div className="text-sm text-gray-600">{user.email}</div>

                <h2 className="text-lg font-bold mt-6">Elérhető quizek</h2>
                <div className="text-gray-500 text-sm">
                    (Itt lesznek listázva a mentett quizek később.)
                </div>

                <button
                    onClick={handleSignOut}
                    className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Kijelentkezés
                </button>
            </div>
            <button
                onClick={() => navigate('/')}
                className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
                aria-label="Back"
            >
                <FaArrowLeft size={20} />
            </button>
        </div>
    );
}
