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
              <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
                <p className="font-bold my-6 text-center">
                  You have already added {wordSet.words.length} words. You can
                  add more or you can start to
                </p>
                <Link
                  href={"/study/card/" + id}
                  className="font-bold bg-green-500 text-white p-1 rounded"
                >
                  Study this set
                </Link>
              </div>
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
    </section>
  );
}
