"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WordSet } from "@/types/types";
import CongratulationsSection from "@/components/CongratulationsSection/CongratulationsSection";
import { shuffleArraySet, validationWritingSubmit } from "@/utils/setHelpers";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import ModeSelection from "@/components/Writing/ModeSelection";
import ModeDisplay from "@/components/Writing/ModeDisplay";
import WritingInterface from "@/components/Writing/WritingInterface";

interface WrongAnswer {
  term: string;
  userInput: string;
  correctAnswer: string;
  mode: "translation" | "term";
}

export default function StudyWritingPage() {
  const router = useRouter();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [temporaryState, setTemporaryState] = useState<WordSet["words"]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTranscription, setShowTranscription] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  const [showTranslationMode, setShowTranslationMode] = useState<
    boolean | null
  >(null);

  const { id } = useParams();

  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((set) => set.id === id);
      if (foundSet) {
        setWordSet(foundSet);
        setTemporaryState(shuffleArraySet(foundSet.words));
      } else {
        router.push("/");
      }
    }
  }, [id, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wordSet || !temporaryState[currentIndex]) return;

    const currentWord = temporaryState[currentIndex];
    const correctAnswer = showTranslationMode
      ? currentWord.definition
      : currentWord.term;

    const res = validationWritingSubmit(userInput, correctAnswer);
    setIsCorrect(res);

    // Track correct/incorrect answers
    if (res) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        {
          term: currentWord.term,
          userInput: userInput.trim(),
          correctAnswer: correctAnswer,
          mode: showTranslationMode ? "translation" : "term",
        },
      ]);
    }
  };

  const handleNext = () => {
    if (isCorrect !== null) {
      setCurrentIndex((prev) => prev + 1);
      setIsCorrect(null);
      setUserInput("");
    }
  };

  // Focus input when moving to next question or when mode is selected
  useEffect(() => {
    if (showTranslationMode !== null && isCorrect === null) {
      const input = document.querySelector(
        'input[name="userInput"]'
      ) as HTMLInputElement;
      if (input && !input.disabled) {
        input.focus();
      }
    }
  }, [currentIndex, showTranslationMode, isCorrect]);

  // Handle keyboard events for Enter key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (isCorrect === null && userInput.trim().length > 0) {
          // Submit the form
          const form = document.querySelector("form");
          if (form) {
            form.requestSubmit();
          }
        } else if (isCorrect !== null) {
          // Move to next question
          handleNext();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isCorrect, userInput]);

  if (!wordSet) return <p>Loading...</p>;

  // Check if we've completed all items (currentIndex has moved past the last item)
  const isCompleted = currentIndex >= temporaryState.length;

  if (isCompleted) {
    return (
      <BaseLayout
        breadcrumbs={[
          { label: "Back on main page", href: "/" },
          { label: "Back on study set page", href: `/study/${wordSet.id}` },
        ]}
        title="Writing Task Completed"
      >
        <CongratulationsSection id={wordSet.id}>
          <h3 className="text-lg font-bold text-center">
            Writing Task Finished
          </h3>
          <p className="text-lg mt-2 text-center">
            You have completed the writing of the words in the set. Well done!
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
                      Mode
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
                      <td className="border border-gray-300 px-4 py-2 text-blue-600">
                        {wrongAnswer.mode === "translation"
                          ? "Translation"
                          : "Term"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-red-600">
                        {wrongAnswer.userInput}
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
                  {Math.round((correctAnswers / temporaryState.length) * 100)}%
                  accuracy
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
      </BaseLayout>
    );
  }

  const currentWord = temporaryState[currentIndex];

  return (
    <BaseLayout
      breadcrumbs={[
        { label: "Back on main page", href: "/" },
        { label: "Back on study set page", href: `/study/${wordSet.id}` },
      ]}
      title="Writing Task"
    >
      {showTranslationMode === null ? (
        <ModeSelection onModeSelect={setShowTranslationMode} />
      ) : (
        <>
          <ModeDisplay
            showTranslationMode={showTranslationMode}
            showTranscription={showTranscription}
            onTranscriptionToggle={() =>
              setShowTranscription(!showTranscription)
            }
          />
          <WritingInterface
            state={{
              currentWord,
              currentIndex,
              totalWords: temporaryState.length,
              showTranslationMode,
              showTranscription,
              userInput,
              isCorrect,
            }}
            handlers={{
              onInputChange: setUserInput,
              onSubmit: handleSubmit,
              onNext: handleNext,
            }}
          />
        </>
      )}
    </BaseLayout>
  );
}
