import './index.css';
import {Board} from './components/Board';
import {useQuiz} from './context/QuizContext';
import {useNavigate} from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

function App() {
    const {categories, markUsed} = useQuiz();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center text-black">
            <div className="w-full max-w-screen-lg px-4 flex flex-col items-center text-center">
                <h1 className="text-4xl font-bold mb-8">Vágó Pesta</h1>
                <Board data={categories} onSelect={(catIndex, qIndex, used) => markUsed(catIndex, qIndex, used)}/>
            </div>
            <button
                onClick={() => navigate('/settings')}
                className="absolute bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
                aria-label="Settings"
            >
                <FaCog size={20} />
            </button>
        </div>
    );
}

export default App;
