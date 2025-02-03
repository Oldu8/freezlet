import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WordSet } from "@/types/types";

export default function TestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((set) => set.id === params.id);
      if (foundSet) {
        setWordSet(foundSet);
        generateOptions(foundSet.words, 0);
      } else {
        router.push("/");
      }
    }
  }, [params.id, router]);

  const generateOptions = (words: WordSet["words"], index: number) => {
    const correctDefinition = words[index].definition;
    let incorrectOptions = words
      .filter((_, i) => i !== index)
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
    <div className="max-w-xl mx-auto p-4">
      {!isFinished ? (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {wordSet.words[currentIndex].term}
          </h2>
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
      ) : (
        <div>
          <h2 className="text-xl font-bold">Тест завершен!</h2>
          <p className="mt-2">
            Вы ответили правильно на {correctAnswers} из {wordSet.words.length}{" "}
            вопросов.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            На главную
          </button>
        </div>
      )}
    </div>
  );
}
