import { Word, WordSet } from "@/types/types";
import { useState } from "react";

export interface AddTermsProps {
  showArea: boolean;
  wordSet: WordSet;
  setWordSet: (updatedSet: WordSet) => void;
  saveChanges: (updatedSet: WordSet) => void;
}
export const AddTermsSection = ({
  showArea,
  wordSet,
  setWordSet,
  saveChanges,
}: AddTermsProps) => {
  const [newWord, setNewWord] = useState<Word>({ term: "", definition: "" });
  const [bulkWords, setBulkWords] = useState("");

  const addBulkWords = () => {
    if (!bulkWords.trim()) return;

    const parsedWords = bulkWords
      .split("\n") // Split into lines
      .map((line) => line.split(/\t+/)) // Split by tabs
      .filter((arr) => arr.length === 2) // Ensure valid format
      .map(([term, definition]) => ({
        term: term.trim(),
        definition: definition.trim(),
      }));

    if (wordSet && parsedWords.length > 0) {
      const updatedSet = {
        ...wordSet,
        words: [...wordSet.words, ...parsedWords],
      };
      setWordSet(updatedSet);
      saveChanges(updatedSet);
      setBulkWords(""); // Clear textarea after adding
    }
  };

  // Handle word addition
  const addWord = () => {
    if (wordSet && newWord.term && newWord.definition) {
      const updatedSet = { ...wordSet, words: [...wordSet.words, newWord] };
      setWordSet(updatedSet);
      saveChanges(updatedSet);
      setNewWord({ term: "", definition: "" });
    }
  };

  if (showArea) {
    return (
      <div>
        <label htmlFor="words" className="block font-bold mb-2">
          Paste words and definitions (tab-separated):
        </label>
        <textarea
          id="words"
          className="w-full h-40 p-3 border rounded bg-gray-100 font-mono text-sm"
          placeholder={`Example:\nruido\tnoise\ntierra\tearth\nquerer\twant`}
          value={bulkWords}
          onChange={(e) => setBulkWords(e.target.value)}
        />
        <button
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
          onClick={addBulkWords}
        >
          Add
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 flex gap-2 w-full justify-between py-2">
      <input
        type="text"
        placeholder="Word"
        className="border p-2 w-1/2"
        value={newWord.term}
        onChange={(e) => setNewWord({ ...newWord, term: e.target.value })}
      />
      <input
        type="text"
        placeholder="Definition"
        className="border p-2 w-1/2"
        value={newWord.definition}
        onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
      />
      <button onClick={addWord} className="bg-blue-500 text-white p-2">
        Add
      </button>
    </div>
  );
};
