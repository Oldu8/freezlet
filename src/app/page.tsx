"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { WordSet } from "@/types/types";

export default function HomePage() {
  const router = useRouter();
  const [wordSets, setWordSets] = useState<WordSet[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      setWordSets(JSON.parse(storedSets));
    }
  }, []);

  const createSet = () => {
    const newSet: WordSet = {
      id: uuidv4(),
      name: newSetName.trim(),
      words: [],
    };
    const updatedSets = [...wordSets, newSet];
    setWordSets(updatedSets);
    localStorage.setItem("wordSets", JSON.stringify(updatedSets));
    router.push(`/set/${newSet.id}`);
  };

  const deleteSet = (id: string) => {
    const updatedSets = wordSets.filter((set) => set.id !== id);
    setWordSets(updatedSets);
    localStorage.setItem("wordSets", JSON.stringify(updatedSets));
    setConfirmDelete(null);
  };

  return (
    <section>
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this set?</p>
            <div className="flex gap-8 items-center justify-center">
              <button
                onClick={() => deleteSet(confirmDelete)}
                className="bg-red-500 text-white px-4 py-3 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-500 text-white px-4 py-3 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="mb-4 bg-green-500 text-white p-2 rounded"
        >
          Create New Set
        </button>
      ) : (
        <div className="mb-4 p-4 border rounded bg-gray-100">
          <input
            type="text"
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            placeholder="Enter set name..."
            className="p-2 border rounded w-full mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={createSet}
              disabled={newSetName.trim().length < 3}
              className={`p-2 rounded text-white ${
                newSetName.trim().length < 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setNewSetName("");
              }}
              className="p-2 rounded bg-red-500 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">
          You have {wordSets.length} set{wordSets.length === 1 ? "" : "s"}.
        </h3>
        <div className="border border-gray-300 p-3 rounded">
          <ul className="space-y-3">
            {wordSets.length > 0 ? (
              wordSets.map((set) => (
                <li
                  key={set.id}
                  className="flex justify-between items-center border p-3"
                >
                  <span className="font-bold">{set.name}</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/set/${set.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/study/${set.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Study
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(set.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No sets available.</p>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
