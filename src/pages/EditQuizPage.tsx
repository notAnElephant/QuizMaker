import {useEffect, useState, ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {auth} from '../lib/firebase';
import {FaArrowLeft} from 'react-icons/fa';

type Content = any;

export default function EditQuizPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState<Content>({categories: []});

  useEffect(() => {
    const load = async () => {
      if (id && id !== 'new') {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/quizzes/${id}`, {headers:{Authorization:`Bearer ${token}`}});
        if (res.ok) {
          const q = await res.json();
          setTitle(q.title);
          setDescription(q.description || '');
          setContent(q.content || {categories: []});
        }
      }
    };
    load();
  }, [id]);

  const save = async () => {
    const token = await auth.currentUser?.getIdToken();
    const body = JSON.stringify({title, description, content});
    if (id === 'new') {
      await fetch('/api/quizzes', {method: 'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body});
    } else {
      await fetch(`/api/quizzes/${id}`, {method: 'PUT', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body});
    }
    navigate('/editor');
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      file.text().then(t => setContent(JSON.parse(t)));
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(content, null, 2);
    const url = URL.createObjectURL(new Blob([data], {type: 'application/json'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'quiz'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-8 text-black flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{id === 'new' ? 'Új quiz' : 'Quiz szerkesztése'}</h1>
      <input className="border p-2" placeholder="Cím" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="border p-2" placeholder="Leírás" value={description} onChange={e=>setDescription(e.target.value)} />
      <textarea className="border p-2 h-64" value={JSON.stringify(content, null, 2)} onChange={e=>setContent(JSON.parse(e.target.value))} />
      <div className="flex gap-2">
        <button onClick={save} className="bg-blue-600 text-white px-3 py-2 rounded">Mentés</button>
        <button onClick={handleExport} className="bg-green-600 text-white px-3 py-2 rounded">Export JSON</button>
        <label className="bg-gray-200 px-3 py-2 rounded cursor-pointer">
          Import JSON
          <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </label>
      </div>
      <button onClick={()=>navigate('/editor')} className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700" aria-label="Back">
        <FaArrowLeft size={20}/>
      </button>
    </div>
  );
}
