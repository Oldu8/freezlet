import { useState } from "react";
import { Word, WordSet } from "@/types/types";

interface WordListProps {
  wordSet: WordSet;
  setWordSet: (updatedSet: WordSet) => void;
  saveChanges: (updatedSet: WordSet) => void;
}

export default function EditWordList({
  wordSet,
  setWordSet,
  saveChanges,
}: WordListProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedWord, setEditedWord] = useState<Word>({
    term: "",
    definition: "",
  });

  const removeWord = (index: number) => {
    const updatedWords = wordSet.words.filter((_, i) => i !== index);
    const updatedSet = { ...wordSet, words: updatedWords };
    setWordSet(updatedSet);
    saveChanges(updatedSet);
  };

  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditedWord(wordSet.words[index]);
  };

  const saveEdit = (index: number) => {
    if (!editedWord.term || !editedWord.definition) return;

    const updatedWords = [...wordSet.words];
    updatedWords[index] = editedWord;

    const updatedSet = { ...wordSet, words: updatedWords };
    setWordSet(updatedSet);
    saveChanges(updatedSet);
    setEditIndex(null);
  };

  return (
    <ul className="w-full">
      {wordSet.words.map((word, index) => (
        <li
          key={index}
          className="border p-3 mb-2 flex justify-between items-center min-h-[42px]"
        >
          {editIndex === index ? (
            <div className="flex gap-2 w-full">
              <input
                type="text"
                className="border p-1 w-1/2"
                value={editedWord.term}
                onChange={(e) =>
                  setEditedWord({ ...editedWord, term: e.target.value })
                }
              />
              <input
                type="text"
                className="border p-1 w-1/2"
                value={editedWord.definition}
                onChange={(e) =>
                  setEditedWord({ ...editedWord, definition: e.target.value })
                }
              />
              <div className="min-w-[150px] max-w-[150px] flex justify-end">
                <button
                  onClick={() => saveEdit(index)}
                  className="bg-green-500 text-white px-3 py-1 rounded w-full"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between w-full items-center">
              <span className="font-bold">{word.term}</span>
              <strong>-</strong>
              <span>{word.definition}</span>
              <div className="w-[150px] flex gap-2">
                <button
                  onClick={() => startEditing(index)}
                  className="bg-blue-500 text-white px-3 py-1 rounded flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeWord(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded flex-1"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
