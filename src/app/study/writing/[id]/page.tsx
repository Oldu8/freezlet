"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WordSet } from "@/types/types";
import CongratulationsSection from "@/components/CongratulationsSection/CongratulationsSection";
import { shuffleArraySet, validationWritingSubmit } from "@/utils/setHelpers";
import FeedbackSection from "@/components/Writing/FeedbackSection";
import BaseLayout from "@/components/BaseLayout/BaseLayout";

export default function StudyWritingPage() {
  const router = useRouter();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [temporaryState, setTemporaryState] = useState<WordSet["words"]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTranscription, setShowTranscription] = useState(false);

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
  };

  const handleNext = () => {
    if (isCorrect !== null) {
      setCurrentIndex((prev) => (prev + 1) % temporaryState.length);
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

  if (currentIndex === temporaryState.length - 1)
    return (
      <CongratulationsSection id={wordSet.id}>
        <p>
          You have completed the writing of the words in the set. Well done!
        </p>
      </CongratulationsSection>
    );

  const currentWord = temporaryState[currentIndex];
  const displayText = showTranslationMode
    ? currentWord.term
    : currentWord.definition;

  return (
    <BaseLayout
      breadcrumbs={[
        { label: "Back on main page", href: "/" },
        { label: "Back on study set page", href: `/study/${wordSet.id}` },
      ]}
      title="Writing Task"
    >
      {/* Mode Selection */}
      {showTranslationMode === null ? (
        <div className="mb-4 flex flex-col items-center gap-4">
          <p className="text-start text-lg w-full">
            Just before you start, please choose a mode.
            <br />
            You can select it once before starting.
            <br />
            Then you can start new study run with new mode.
            <br />
            You can write definitions of terms or terms by it definition
          </p>
          <p>So please what mode do you want:</p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowTranslationMode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Term → Definition
            </button>
            <button
              onClick={() => setShowTranslationMode(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Definition → Term
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mode Display */}
          <div className="mb-4 flex flex-row gap-2 items-center">
            <p className="text-lg font-semibold">
              Mode:{" "}
              {showTranslationMode ? "Term → Definition" : "Definition → Term"}
            </p>
            <div className="flex flex-row gap-2 items-center ml-auto">
              show transcription:{" "}
              <input
                type="checkbox"
                checked={showTranscription}
                onChange={() => setShowTranscription(!showTranscription)}
              />
            </div>
          </div>
          <div className="border p-2 md:p-6 text-center text-xl mb-4">
            {/* Current Word */}
            <div className="mb-4">
              <p className="text-lg ">
                Write {showTranslationMode ? "definition" : "term"} for:{" "}
                <strong>{displayText}</strong>
              </p>
              <p className="text-sm text-gray-400">
                {showTranscription ? currentWord?.transcription : ""}
              </p>
            </div>

            {/* Input Section */}
            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
              <input
                type="text"
                name="userInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Type your answer here..."
                disabled={isCorrect !== null}
                autoFocus
              />
              {isCorrect === null ? (
                <button
                  type="submit"
                  disabled={userInput.trim().length === 0}
                  className={`px-4 py-2 rounded text-white ${
                    userInput.trim().length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500"
                  }`}
                >
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded text-white bg-blue-500"
                >
                  Next
                </button>
              )}
            </form>

            <FeedbackSection
              isCorrect={isCorrect}
              showTranslationMode={showTranslationMode}
              currentWord={currentWord}
              userInput={userInput}
            />

            {/* Remaining Cards */}
            <p className="mt-4">
              Remaining cards: {temporaryState.length - currentIndex - 1}
            </p>
          </div>
        </>
      )}
    </BaseLayout>
  );
}
