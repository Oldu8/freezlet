"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WordSet } from "@/types/types";
import CongratulationsSection from "@/components/CongratulationsSection/CongratulationsSection";
import BaseLayout from "@/components/BaseLayout/BaseLayout";

export default function StudyQuizPage() {
  const router = useRouter();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((set) => set.id === id);
      if (foundSet) {
        setWordSet(foundSet);
        generateOptions(foundSet.words, 0);
      } else {
        router.push("/");
      }
    }
  }, [id, router]);

  const generateOptions = (words: WordSet["words"], index: number) => {
    const correctDefinition = words[index].definition;
    let incorrectOptions = words
      .filter((word, i) => i !== index && word.definition !== correctDefinition) // Ensure unique definitions
      .map((word) => word.definition);

    incorrectOptions = incorrectOptions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    setOptions(
      [...incorrectOptions, correctDefinition].sort(() => 0.5 - Math.random())
    );
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (wordSet && answer === wordSet.words[currentIndex].definition) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setTimeout(() => {
      if (wordSet && currentIndex < wordSet.words.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        generateOptions(wordSet.words, currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  if (!wordSet) return <p>Loading...</p>;

  return (
    <BaseLayout
      breadcrumbs={[
        { label: "Back on main page", href: "/" },
        { label: "Back on study set page", href: `/study/${wordSet.id}` },
      ]}
      title="Select the correct definition for the word:"
    >
      <div className="w-full mx-auto p-4">
        {!isFinished ? (
          <div className="w-full">
            <div className="my-4 p-4 border rounded">
              <h5 className="text-xl font-bold mb-2 text-center">
                {wordSet.words[currentIndex].term}
              </h5>
              {wordSet.words[currentIndex].transcription && (
                <p className="text-center text-gray-500 mb-4">
                  {wordSet.words[currentIndex].transcription}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className={`p-3 border rounded text-left transition-all
                  ${
                    selectedAnswer === option
                      ? option === wordSet.words[currentIndex].definition
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <CongratulationsSection id={wordSet.id}>
              <h3 className="text-lg font-bold text-center">Quiz Finished</h3>
              <p className="text-lg mt-2 text-center">
                You answered correctly on {correctAnswers} out of{" "}
                {wordSet.words.length} questions.
              </p>
            </CongratulationsSection>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
