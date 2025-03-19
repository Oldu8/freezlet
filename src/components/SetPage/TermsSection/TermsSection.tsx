import { AddTermsSection } from "@/components/SetPage/AddTermsSection/AddTermsSection";
import { WordSet } from "@/types/types";
import { useState } from "react";

interface TermsSectionProps {
  wordSet: WordSet;
  setWordSet: (updatedSet: WordSet) => void;
  saveChanges: (updatedSet: WordSet) => void;
}

export const TermsSection = ({
  wordSet,
  setWordSet,
  saveChanges,
}: TermsSectionProps) => {
  const [showArea, setShowArea] = useState<boolean>(false);

  return (
    <>
      <div className="mb-5 flex gap-2 items-center justify-center">
        <div className="flex border border-gray-300 rounded overflow-hidden">
          <button
            className={`px-3 py-1 ${
              !showArea ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setShowArea(false)}
          >
            One by one
          </button>
          <button
            className={`px-3 py-1 ${
              showArea ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setShowArea(true)}
          >
            All the words
          </button>
        </div>
      </div>
      <AddTermsSection
        saveChanges={saveChanges}
        showArea={showArea}
        wordSet={wordSet}
        setWordSet={setWordSet}
      />
    </>
  );
};
