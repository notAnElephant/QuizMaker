import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {auth} from '../lib/firebase';
import {FaArrowLeft} from 'react-icons/fa';

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch('/api/quizzes', {headers: {Authorization: `Bearer ${token}`}});
    if (res.ok) setQuizzes(await res.json());
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Biztos törlöd?')) return;
    const token = await auth.currentUser?.getIdToken();
    await fetch(`/api/quizzes/${id}`, {method: 'DELETE', headers: {Authorization: `Bearer ${token}`}});
    load();
  };

  return (
    <div className="min-h-screen p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Quizek</h1>
      <button onClick={() => navigate('/editor/new')} className="mb-4 bg-blue-600 text-white px-3 py-2 rounded">
        Új quiz
      </button>
      <ul className="space-y-2">
        {quizzes.map(q => (
          <li key={q.quiz_id} className="border p-2 flex justify-between">
            <span>{q.title}</span>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/editor/${q.quiz_id}`)} className="text-blue-600">Szerkesztés</button>
              <button onClick={() => remove(q.quiz_id)} className="text-red-600">Törlés</button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/')} className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700" aria-label="Back">
        <FaArrowLeft size={20}/>
      </button>
    </div>
  );
}
