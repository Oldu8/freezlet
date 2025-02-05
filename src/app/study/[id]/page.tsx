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
          <div>
            <p>
              You can start learning words from your sets. To start learning
              select type of study you want:
            </p>
            <ul className="my-4 flex flex-col gap-8 w-full">
              <li className="flex flex-row gap-2 border p-2 items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-lg">Quiz</p>
                  <p>
                    Here you will have to find correct definition from 4
                    options.
                  </p>
                  <p>Best for memorizing meanings</p>
                </div>
                <Link
                  className="ml-auto font-bold p-2 bg-blue-500 text-white rounded min-w-[115px] text-center"
                  href={`/study/quiz/${wordSet.id}`}
                >
                  Start Quiz
                </Link>
              </li>
              <li className="flex flex-row gap-2 border p-2 items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-lg">Cards</p>
                  <p>
                    This will show you cards with terms and hidden/visible
                    definitions.
                  </p>
                  <p>Best for familiarizing with words </p>
                </div>
                <Link
                  className="ml-auto font-bold p-2 bg-purple-500 text-white rounded min-w-[115px] text-center"
                  href={`/study/card/${wordSet.id}`}
                >
                  Start Cards
                </Link>
              </li>
              <li className="flex flex-row gap-2 border p-2 items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-lg">Writing</p>
                  <p>
                    This will show you words and you have to write definitions
                    or vice versa
                  </p>
                  <p>Best for learn correct writing</p>
                </div>
                <Link
                  className="ml-auto font-bold p-2 bg-green-500 text-white rounded min-w-[115px] text-center"
                  href={`/study/writing/${wordSet.id}`}
                >
                  Start Writing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
