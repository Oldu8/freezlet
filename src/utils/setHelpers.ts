import { WordSet } from "@/types/types";

export const shuffleArraySet = (array: WordSet["words"]): WordSet["words"] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// TODO: add strict mode like if user didn't use accent or capital letters
export const validationWritingSubmit = (
  userInput: string,
  currentWord: string
) => {
  return userInput.trim().toLowerCase() === currentWord.trim().toLowerCase();
};
