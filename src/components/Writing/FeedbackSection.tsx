interface FeedbackSectionProps {
  isCorrect: boolean | null;
  showTranslationMode: boolean;
  currentWord: {
    definition: string;
    term: string;
  };
  userInput: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  isCorrect,
  showTranslationMode,
  currentWord,
  userInput,
}) => {
  if (isCorrect === null) {
    return (
      <div className="p-4 bg-blue-100 text-blue-700 rounded mb-4 min-h-[88px]">
        <p>Waiting for your answer...</p>
      </div>
    );
  }

  if (isCorrect === true) {
    return (
      <div className="p-4 bg-green-100 text-green-700 rounded mb-4 min-h-[88px]">
        <p>Correct!</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-100 text-red-700 rounded mb-4 min-h-[88px]">
      <p>
        Incorrect! The correct answer is:{" "}
        <strong>
          {showTranslationMode ? currentWord.definition : currentWord.term}
        </strong>
      </p>
      <p>
        You entered: <strong>{userInput}</strong>
      </p>
    </div>
  );
};

export default FeedbackSection;
