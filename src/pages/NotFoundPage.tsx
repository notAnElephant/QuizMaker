import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-5xl font-bold mb-6">404</h1>
            <p className="text-lg mb-8">Ezt elbohóckodtad 🥵 Valszeg nem ide akartál kilyukadni, öcsisajt</p>
            <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
            >
                Nyomás vissza
            </button>
        </div>
    );
}
