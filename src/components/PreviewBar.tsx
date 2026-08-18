import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PreviewBar({ fixed = false }: { fixed?: boolean }) {
  const navigate = useNavigate();

  return (
    <header
      className={`${fixed ? "fixed inset-x-0 top-0" : "sticky top-0"} z-20 flex w-full items-center justify-between gap-4 border-b-2 border-[#24211c] bg-[#fff4d6]/95 px-4 py-3 text-[#24211c] sm:px-6`}
    >
      <button
        onClick={() => navigate("/editor")}
        className="inline-flex items-center gap-2 font-bold"
      >
        <FaArrowLeft aria-hidden="true" />
        Szerkesztő
      </button>
      <strong>Előnézet · a játékállás nem változik</strong>
    </header>
  );
}
