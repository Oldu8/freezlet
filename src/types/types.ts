export type Word = { term: string; definition: string; transcription?: string };
export type WordSet = { id: string; name: string; words: Word[] };
