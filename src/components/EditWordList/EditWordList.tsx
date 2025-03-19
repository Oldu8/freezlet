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
    <ul className="w-full space-y-2">
      {wordSet.words.map((word, index) => (
        <li
          key={index}
          className="border p-3 rounded-lg flex flex-col md:flex-row items-center justify-between bg-white shadow-md"
        >
          {editIndex === index ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full mb-2 md:mb-0">
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={editedWord.term}
                onChange={(e) =>
                  setEditedWord({ ...editedWord, term: e.target.value })
                }
              />
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={editedWord.transcription ?? ""}
                onChange={(e) =>
                  setEditedWord({
                    ...editedWord,
                    transcription: e.target.value,
                  })
                }
                placeholder="Transcription (optional)"
              />
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={editedWord.definition}
                onChange={(e) =>
                  setEditedWord({ ...editedWord, definition: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full text-center">
              <span className="font-bold text-lg md:text-base">
                {word.term}
              </span>
              <span className="text-gray-600 text-lg md:text-base">
                {word?.transcription ?? ""}
              </span>
              <span className="font-bold text-lg md:text-base">
                {word.definition}
              </span>
            </div>
          )}

          <div className="w-full md:w-auto flex gap-2 mt-2 md:mt-0">
            {editIndex === index ? (
              <button
                onClick={() => saveEdit(index)}
                className="bg-green-500 text-white px-3 ml-0 md:ml-1 py-1 md:py-2 rounded w-full md:w-auto"
              >
                Save
              </button>
            ) : (
              <>
                <button
                  onClick={() => startEditing(index)}
                  className="bg-blue-500 text-white px-3 py-1 rounded w-full md:w-auto"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeWord(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded w-full md:w-auto"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
