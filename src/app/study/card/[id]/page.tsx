"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { WordSet, Word } from "@/types/types";
import BaseLayout from "@/components/BaseLayout/BaseLayout";

export default function StudyCardPage() {
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
    <BaseLayout
      breadcrumbs={[
        { label: "Back on main page", href: "/" },
        { label: "Back on study set page", href: `/study/${id}` },
      ]}
      title={`Your learning set: ${wordSet?.name || "Loading..."}`}
    >
      {wordSet ? (
        <div className="w-full">
          <p className="mb-4">
            This is your infinity cards with terms and definitions. Try to
            remember these words and then check your knowledge in the quiz or
            writing mode.
          </p>
          {/* Flashcard */}
          <div className="border p-6 text-center text-xl mb-4">
            {shuffledWords.length > 0 ? (
              <>
                <p className="font-bold">{shuffledWords[currentIndex].term}</p>
                <p className="text-center text-gray-400 mb-4">
                  {shuffledWords[currentIndex].transcription}
                </p>
                <p className="text-gray-500 mt-2 min-h-[28px]">
                  {showAnswer && (
                    <span>{shuffledWords[currentIndex].definition}</span>
                  )}
                </p>
              </>
            ) : (
              <p>No words in this set.</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between gap-4">
            <button
              onClick={prevCard}
              className="bg-teal-500 text-white p-2 rounded"
            >
              Previous
            </button>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
            <button
              onClick={nextCard}
              className="bg-teal-500 text-white p-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </BaseLayout>
  );
}
