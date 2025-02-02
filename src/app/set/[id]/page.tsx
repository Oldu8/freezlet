"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { WordSet, Word } from "@/types/types";

export default function EditSetPage() {
  const { id } = useParams();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [newWord, setNewWord] = useState<Word>({ term: "", definition: "" });
  const [showArea, setShowArea] = useState(false);
  const [bulkWords, setBulkWords] = useState(""); // Stores textarea content

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

  // Load set from localStorage
  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((s) => s.id === id);
      if (foundSet) setWordSet(foundSet);
    }
  }, [id]);

  // Save changes to localStorage
  const saveChanges = (updatedSet: WordSet) => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const updatedSets = sets.map((s) => (s.id === id ? updatedSet : s));
      localStorage.setItem("wordSets", JSON.stringify(updatedSets));
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

  return (
    <section className="flex flex-col items-start">
      <Link
        href="/"
        className="my-4 font-bold bg-gray-400 text-white p-2 rounded"
      >
        Back on main page
      </Link>
      <div className="w-full">
        {wordSet ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Set name: {wordSet.name}
            </h2>

            <div className="mb-4 flex gap-2 items-center">
              <p>{showArea ? "All the words or:" : "One by one or:"}</p>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => setShowArea((prev) => !prev)}
              >
                {showArea ? "One by one" : "All the words"}
              </button>
            </div>
            {showArea ? (
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
            ) : (
              <div className="mb-4 flex gap-2 w-full justify-between py-2">
                <input
                  type="text"
                  placeholder="Word"
                  className="border p-2 w-1/2"
                  value={newWord.term}
                  onChange={(e) =>
                    setNewWord({ ...newWord, term: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Definition"
                  className="border p-2 w-1/2"
                  value={newWord.definition}
                  onChange={(e) =>
                    setNewWord({ ...newWord, definition: e.target.value })
                  }
                />
                <button
                  onClick={addWord}
                  className="bg-blue-500 text-white p-2"
                >
                  Add
                </button>
              </div>
            )}
            <div className="my-4 ">
              <p className="font-bold my-2 text-center">
                You have already added:
              </p>
              <ul>
                {wordSet.words.map((word, index) => (
                  <li key={index} className="border p-2 mb-2">
                    <span className="font-bold">{word.term}</span>:{" "}
                    {word.definition}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </section>
  );
}
