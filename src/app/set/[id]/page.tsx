"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { WordSet } from "@/types/types";
import EditWordList from "@/components/EditWordList/EditWordList";
import { TermsSection } from "@/components/SetPage/TermsSection/TermsSection";

export default function EditSetPage() {
  const { id } = useParams();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);

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

  return (
    <section className="flex flex-col items-start">
      <Link
        href="/start"
        className="my-4 font-bold bg-gray-400 text-white p-2 rounded"
      >
        Back
      </Link>
      <div className="w-full">
        {wordSet ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Set name: {wordSet.name}
            </h2>
            <TermsSection
              wordSet={wordSet}
              setWordSet={setWordSet}
              saveChanges={saveChanges}
            />
            <div className="my-4 ">
              <div className="border-t border-b border-gray-400"></div>
              <p className="font-bold my-6 text-center">
                You have already added:
              </p>
              <EditWordList
                wordSet={wordSet}
                setWordSet={setWordSet}
                saveChanges={saveChanges}
              />
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="mt-8">
        <Link
          href={"/study/card/" + id}
          className="font-bold bg-green-600 text-white p-3 rounded"
        >
          Study this set
        </Link>
      </div>
    </section>
  );
}
