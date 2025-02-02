"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { WordSet, Word } from "@/types/types";

export default function StudyPage() {
  const { id } = useParams();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load set and shuffle words
  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((s) => s.id === id);
      if (foundSet) {
        setWordSet(foundSet);
        setShuffledWords(shuffleArray(foundSet.words));
      }
    }
  }, [id]);

  // Shuffle function
  const shuffleArray = (array: Word[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Show next card
  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
  };

  // Show previous card
  const prevCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) =>
      prev === 0 ? shuffledWords.length - 1 : prev - 1
    );
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {wordSet ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{wordSet.name}</h1>

          {/* Flashcard */}
          <div className="border p-6 text-center text-xl mb-4">
            {shuffledWords.length > 0 ? (
              <>
                <p className="font-bold">{shuffledWords[currentIndex].term}</p>
                {showAnswer && (
                  <p className="text-gray-500 mt-2">
                    {shuffledWords[currentIndex].definition}
                  </p>
                )}
              </>
            ) : (
              <p>No words in this set.</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button onClick={prevCard} className="bg-gray-500 text-white p-2">
              Previous
            </button>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="bg-blue-500 text-white p-2"
            >
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
            <button onClick={nextCard} className="bg-gray-500 text-white p-2">
              Next
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
