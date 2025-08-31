"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { WordSet } from "@/types/types";
import BaseLayout from "@/components/BaseLayout/BaseLayout";

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
    <BaseLayout
      breadcrumbs={[{ label: "Back on main page", href: "/" }]}
      title="Choose your set you want to study"
    >
      {wordSets.length === 0 ? (
        <div className="my-4 flex flex-col items-center">
          <p className="mb-2 text-sm md:text-base">
            Seems like you don&apos;t have any sets yet.
          </p>
          <p className="text-sm md:text-base">
            It&apos;s not much buttons here, right? So maybe you will hit that
            single green one to start, huh ?
          </p>
        </div>
      ) : (
        <p className="my-2 text-sm md:text-base">
          Oh, I see that you already have some sets. So, now you could chose one
          and press yellow one.
        </p>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 md:p-6 rounded shadow-lg">
            <p className="mb-4 text-sm md:text-base">
              Are you sure you want to delete this set?
            </p>
            <div className="flex gap-4 md:gap-8 items-center justify-center">
              <button
                onClick={() => deleteSet(confirmDelete)}
                className="bg-red-500 text-white px-3 md:px-4 py-2 md:py-3 rounded text-sm md:text-base"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-500 text-white px-3 md:px-4 py-2 md:py-3 rounded text-sm md:text-base"
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
          className="my-4 bg-green-500 text-white p-2 rounded text-sm md:text-base"
        >
          Create New Set
        </button>
      ) : (
        <div className="mb-4 p-3 md:p-4 border rounded bg-gray-100">
          <input
            type="text"
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            placeholder="Enter set name..."
            className="p-2 border rounded w-full mb-2 text-sm md:text-base"
          />
          <div className="flex gap-2">
            <button
              onClick={createSet}
              disabled={newSetName.trim().length < 3}
              className={`p-2 rounded text-white text-sm md:text-base ${
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
              className="p-2 rounded bg-red-500 text-white text-sm md:text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-base md:text-lg font-semibold mb-4">
          You have {wordSets.length} set{wordSets.length === 1 ? "" : "s"}.
        </h3>
        <div className="border border-gray-300 p-2 md:p-3 rounded">
          <ul className="space-y-2 md:space-y-3">
            {wordSets.length > 0 ? (
              wordSets.map((set) => (
                <li
                  key={set.id}
                  className="flex justify-between items-center border p-2 md:p-3"
                >
                  <span className="font-bold text-sm md:text-base">
                    {set.name}
                  </span>
                  <div className="flex gap-1 md:gap-2">
                    <Link
                      href={`/set/${set.id}`}
                      className="bg-blue-500 text-white px-2 md:px-3 py-1 rounded text-sm md:text-base"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/study/${set.id}`}
                      className="bg-yellow-500 text-white px-2 md:px-3 py-1 rounded text-sm md:text-base"
                    >
                      Study
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(set.id)}
                      className="bg-red-500 text-white px-2 md:px-3 py-1 rounded text-sm md:text-base"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm md:text-base">No sets available.</p>
            )}
          </ul>
        </div>
      </div>
    </BaseLayout>
  );
}
