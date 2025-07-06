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
