import "./index.css";
import { Board } from "./components/Board";
import { useQuiz } from "./context/QuizContext";
import { useNavigate } from "react-router-dom";
import { FaCog, FaUsers } from "react-icons/fa";
import TeamBar from "./components/TeamBar.tsx";

function App() {
  const { categories, markUsed } = useQuiz();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center flex-col justify-between text-black">
      <div className="w-full h-full max-w-screen-lg px-4 flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold mb-8 mt-16 font-display">
          Vágó Pesta
        </h1>
        <Board
          data={categories}
          font="font-display"
          onSelect={(catIndex, qIndex, used) =>
            markUsed(catIndex, qIndex, used)
          }
        />
      </div>
      <div className="absolute bottom-4 left-4 flex-1 flex items-start gap-2 flex-col">
        <button
          onClick={() => navigate("/teams")}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
          aria-label="Teams"
        >
          <FaUsers size={20} />
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
          aria-label="Settings"
        >
          <FaCog size={20} />
        </button>
      </div>
      <TeamBar mode={"board"} />
    </div>
  );
}

export default App;
