interface ModeDisplayProps {
  showTranslationMode: boolean;
  showTranscription: boolean;
  onTranscriptionToggle: () => void;
}

export default function ModeDisplay({
  showTranslationMode,
  showTranscription,
  onTranscriptionToggle,
}: ModeDisplayProps) {
  return (
    <div className="mb-4 flex flex-row gap-2 items-center">
      <p className="text-lg font-semibold">
        Mode: {showTranslationMode ? "Term → Definition" : "Definition → Term"}
      </p>
      <div className="flex flex-row gap-2 items-center ml-auto">
        show transcription:{" "}
        <input
          type="checkbox"
          checked={showTranscription}
          onChange={onTranscriptionToggle}
        />
      </div>
    </div>
  );
}
