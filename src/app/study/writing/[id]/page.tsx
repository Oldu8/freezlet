"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WordSet } from "@/types/types";
import Link from "next/link";
// import { ReactComponent as wellDoneImg } from "../../../../../public/svg/wellDone.svg";
import wellDoneImg from "../../../../../public/svg/wellDone.svg";
import Image from "next/image";

export default function StudyWritingPage() {
  const router = useRouter();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [temporaryState, setTemporaryState] = useState<WordSet["words"]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTranslationMode, setShowTranslationMode] = useState<
    boolean | null
  >(null); // null until mode is selected

  const { id } = useParams();

  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((set) => set.id === id);
      if (foundSet) {
        setWordSet(foundSet);
        setTemporaryState(shuffleArray(foundSet.words));
      } else {
        router.push("/");
      }
    }
  }, [id]);

  const shuffleArray = (array: WordSet["words"]): WordSet["words"] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

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
  };

  const handleNext = () => {
    setIsCorrect(null);
    setUserInput("");
    setCurrentIndex((prev) => (prev + 1) % temporaryState.length);
  };

  if (!wordSet) return <p>Loading...</p>;

  if (temporaryState.length === 0)
    return (
      <div className="max-w-xl mx-auto p-4 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
        <p>You finished all the words correctly!</p>
        <div className="my-4 max-h-[300px]">
          <Image src={wellDoneImg} alt="Well done" />
        </div>
        <div className="mt-4 flex flex-row gap-2 items-center mx-auto justify-center">
          <button
            onClick={() => router.push("/")}
            className=" bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to Home
          </button>
          <p>or</p>
          <button
            onClick={() => router.push(`/study/${wordSet.id}`)}
            className=" bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to study page
          </button>
        </div>
      </div>
    );

  const currentWord = temporaryState[currentIndex];
  const displayText = showTranslationMode
    ? currentWord.term
    : currentWord.definition;

  return (
    <section className="flex flex-col items-start  mx-auto">
      <div className="flex flex-row gap-2 items-start">
        <Link
          href="/"
          className="my-4 font-bold bg-gray-400 text-white p-2 rounded"
        >
          Back on main page
        </Link>
        <Link
          href={`/study/${wordSet.id}`}
          className="my-4 font-bold bg-gray-400 text-white p-2 rounded"
        >
          Back on study set page
        </Link>
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Writing Task</h2>

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
            <div className="mb-4">
              <p className="text-lg font-semibold">
                Mode:{" "}
                {showTranslationMode
                  ? "Term → Definition"
                  : "Definition → Term"}
              </p>
            </div>
            <div className="border p-6 text-center text-xl mb-4">
              {/* Current Word */}
              <div className="mb-4">
                <p className="text-lg ">
                  Write {showTranslationMode ? "definition" : "term"} for:{" "}
                  <strong>{displayText}</strong>
                </p>
              </div>

              {/* Input Section */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Предотвращаем перезагрузку страницы
                  handleSubmit();
                }}
                className="mb-4 flex gap-2"
              >
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Type your answer here..."
                />
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
              </form>

              {/* Feedback Section */}
              {isCorrect === null && (
                <div className="p-4 bg-blue-100 text-blue-700 rounded mb-4 min-h-[88px]">
                  <p>Waiting for your answer...</p>
                </div>
              )}
              {isCorrect === true && (
                <div className="p-4 bg-green-100 text-green-700 rounded mb-4 min-h-[88px]">
                  <p>Correct!</p>
                </div>
              )}
              {isCorrect === false && (
                <div className="p-4 bg-red-100 text-red-700 rounded mb-4 min-h-[88px]">
                  <p>
                    Incorrect! The correct answer is:{" "}
                    <strong>
                      {showTranslationMode
                        ? currentWord.definition
                        : currentWord.term}
                    </strong>
                  </p>
                  <p>
                    You entered: <strong>{userInput}</strong>
                  </p>
                </div>
              )}

              {/* Next Question Button */}
              <button
                onClick={handleNext}
                disabled={isCorrect === null}
                className={`mt-4 px-4 py-2 rounded text-white ${
                  isCorrect === null
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500"
                }`}
              >
                Next
              </button>

              {/* Remaining Cards */}
              <p className="mt-4">Remaining cards: {temporaryState.length}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
