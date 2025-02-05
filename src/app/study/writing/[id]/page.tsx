"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WordSet } from "@/types/types";

export default function StudyWritingPage() {
  const router = useRouter();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [temporaryState, setTemporaryState] = useState<WordSet["words"]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTranslationMode, setShowTranslationMode] = useState(true); // true: term -> definition, false: definition -> term

  const { id } = useParams();

  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((set) => set.id === id);
      if (foundSet) {
        setWordSet(foundSet);
        setTemporaryState(foundSet.words);
      } else {
        router.push("/");
      }
    }
  }, [id]);

  const handleSubmit = () => {
    if (!wordSet || !temporaryState[currentIndex]) return;

    const currentWord = temporaryState[currentIndex];
    const correctAnswer = showTranslationMode
      ? currentWord.definition
      : currentWord.term;

    if (userInput.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setIsCorrect(true);
      setTemporaryState((prev) => prev.filter((_, i) => i !== currentIndex));
      setCurrentIndex(0); // Restart from the first card
    } else {
      setIsCorrect(false);
    }

    setUserInput("");
  };

  if (!wordSet) return <p>Loading...</p>;

  if (temporaryState.length === 0)
    return (
      <div className="max-w-xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
        <p>You answered all the words correctly!</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    );

  const currentWord = temporaryState[currentIndex];
  const displayText = showTranslationMode
    ? currentWord.term
    : currentWord.definition;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Writing Task</h2>

      {/* Mode Toggle */}
      <div className="mb-4 flex items-center gap-2">
        <p>Mode:</p>
        <button
          onClick={() => setShowTranslationMode(true)}
          className={`px-4 py-2 rounded ${
            showTranslationMode ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Term → Definition
        </button>
        <button
          onClick={() => setShowTranslationMode(false)}
          className={`px-4 py-2 rounded ${
            !showTranslationMode ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Definition → Term
        </button>
      </div>

      {/* Current Word */}
      <div className="mb-4">
        <p className="text-lg font-semibold">{displayText}</p>
      </div>

      {/* Input Section */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Type your answer here..."
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      {/* Feedback Section */}
      {isCorrect === true && (
        <div className="p-4 bg-green-100 text-green-700 rounded mb-4">
          <p>Correct!</p>
        </div>
      )}
      {isCorrect === false && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          <p>
            Incorrect! The correct answer is:{" "}
            <strong>
              {showTranslationMode ? currentWord.definition : currentWord.term}
            </strong>
          </p>
        </div>
      )}

      {/* Remaining Cards */}
      <p>Remaining cards: {temporaryState.length}</p>
    </div>
  );
}
