"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WordSet } from "@/types/types";
import CongratulationsSection from "@/components/CongratulationsSection/CongratulationsSection";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import { shuffleArraySet } from "@/utils/setHelpers";

const generateOptions = (words: WordSet["words"], index: number) => {
  const correctDefinition = words[index].definition;
  console.log("correct:", correctDefinition);
  const incorrectOptions = words
    .filter((word, i) => i !== index && word.definition !== correctDefinition) // Ensure unique definitions
    .map((word) => word.definition)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  console.log("incorrect:", incorrectOptions);
  return [...incorrectOptions, correctDefinition].sort(
    () => 0.5 - Math.random()
  );
};

interface WrongAnswer {
  term: string;
  selectedAnswer: string;
  correctAnswer: string;
}

export default function StudyQuizPage() {
  const router = useRouter();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [temporaryState, setTemporaryState] = useState<WordSet["words"]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((set) => set.id === id);
      if (foundSet) {
        setWordSet(foundSet);
        console.log("generated options");
        const shuffledWords = shuffleArraySet(foundSet.words);
        setTemporaryState(shuffledWords);
        setOptions(generateOptions(shuffledWords, 0));
      } else {
        router.push("/");
      }
    }
  }, [id, router]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (temporaryState && answer === temporaryState[currentIndex].definition) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      // Track wrong answer
      setWrongAnswers((prev) => [
        ...prev,
        {
          term: temporaryState[currentIndex].term,
          selectedAnswer: answer,
          correctAnswer: temporaryState[currentIndex].definition,
        },
      ]);
    }
    setTimeout(() => {
      if (temporaryState && currentIndex < temporaryState.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setOptions(generateOptions(temporaryState, currentIndex + 1));
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
      <div className="w-full mx-auto p-1 md:p-4">
        {!isFinished ? (
          <div className="w-full">
            <div className="my-4 p-4 border rounded relative">
              <p className="text-xs md:text-sm text-gray-600 absolute top-0 right-0 pr-2 pt-2">
                {currentIndex + 1} of {temporaryState.length}
              </p>
              <h5 className="text-xl font-bold mb-2 text-center">
                {temporaryState[currentIndex].term}
              </h5>
              {temporaryState[currentIndex].transcription && (
                <p className="text-center text-gray-500 mb-4">
                  {temporaryState[currentIndex].transcription}
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
                      ? option === temporaryState[currentIndex].definition
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : selectedAnswer !== null &&
                        option === temporaryState[currentIndex].definition
                      ? "bg-green-200 text-green-800"
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
                {temporaryState.length} questions.
              </p>
            </CongratulationsSection>

            {/* Wrong Answers Table */}
            {wrongAnswers.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-center">
                  Review Your Mistakes
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Term
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Your Answer
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Correct Answer
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {wrongAnswers.map((wrongAnswer, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">
                            {wrongAnswer.term}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-red-600">
                            {wrongAnswer.selectedAnswer}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-green-600">
                            {wrongAnswer.correctAnswer}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Score */}
                <div className="mt-6 text-center">
                  <div className="inline-block bg-gray-100 rounded-lg px-6 py-3">
                    <p className="text-lg font-semibold">
                      Final Score: {correctAnswers} / {temporaryState.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.round(
                        (correctAnswers / temporaryState.length) * 100
                      )}
                      % accuracy
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Show score even if no wrong answers */}
            {wrongAnswers.length === 0 && (
              <div className="mt-6 text-center">
                <div className="inline-block bg-green-100 rounded-lg px-6 py-3">
                  <p className="text-lg font-semibold text-green-800">
                    Perfect Score! {correctAnswers} / {temporaryState.length}
                  </p>
                  <p className="text-sm text-green-600">
                    100% accuracy - Excellent work!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
