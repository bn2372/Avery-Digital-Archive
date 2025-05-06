import React from "react";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();

  function handleStart() {
    navigate("/gallery");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-sans bg-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to the Digital Archive!</h1>
      <p className="text-lg mb-12 text-center max-w-2xl">
        Become a digital archivist and help us preserve Avery Hall's digital artifacts for the next 100 years!
      </p>
      <button
        onClick={handleStart}
        className="px-8 py-4 bg-blue-600 text-white text-xl rounded hover:bg-blue-700"
      >
        Start Archiving
      </button>
    </div>
  );
}
