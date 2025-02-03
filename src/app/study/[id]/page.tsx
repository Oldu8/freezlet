"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
import { WordSet } from "@/types/types";
import Link from "next/link";

export default function StudyPage() {
  const { id } = useParams();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);

  // Load set and shuffle words
  useEffect(() => {
    const storedSets = localStorage.getItem("wordSets");
    if (storedSets) {
      const sets: WordSet[] = JSON.parse(storedSets);
      const foundSet = sets.find((s) => s.id === id);
      if (foundSet) {
        setWordSet(foundSet);
      }
    }
  }, [id]);

  return (
    <section className="flex flex-col items-start">
      <Link
        href="/"
        className="my-4 font-bold bg-gray-400 text-white p-2 rounded"
      >
        Back on main page
      </Link>
      {wordSet ? (
        <div className="w-full">
          <h3 className="text-2xl font-bold mb-4">
            Your learning set: {wordSet.name}
          </h3>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
