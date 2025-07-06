import { Word } from "@/types/types";
import FeedbackSection from "./FeedbackSection";

interface WritingState {
  currentWord: Word;
  currentIndex: number;
  totalWords: number;
  showTranslationMode: boolean;
  showTranscription: boolean;
  userInput: string;
  isCorrect: boolean | null;
}

interface WritingHandlers {
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onNext: () => void;
}

interface WritingInterfaceProps {
  state: WritingState;
  handlers: WritingHandlers;
}

export default function WritingInterface({
  state,
  handlers,
}: WritingInterfaceProps) {
  const {
    currentWord,
    currentIndex,
    totalWords,
    showTranslationMode,
    showTranscription,
    userInput,
    isCorrect,
  } = state;

  const { onInputChange, onSubmit, onNext } = handlers;

  // Calculate derived values internally
  const displayText = showTranslationMode
    ? currentWord.term
    : currentWord.definition;

  const remainingCards = totalWords - currentIndex - 1;

  return (
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
      <form onSubmit={onSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          name="userInput"
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
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
            onClick={onNext}
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
      <p className="mt-4">Remaining cards: {remainingCards}</p>
    </div>
  );
}
