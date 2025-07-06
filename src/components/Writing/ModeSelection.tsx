interface ModeSelectionProps {
  onModeSelect: (mode: boolean) => void;
}

export default function ModeSelection({ onModeSelect }: ModeSelectionProps) {
  return (
    <div className="mb-4 flex flex-col items-center gap-4">
      <p className="text-start text-lg w-full">
        Just before you start, please choose a mode.
        <br />
        You can select it once before starting.
        <br />
        Then you can start new study run with new mode.
        <br />
        You can write definitions of terms or terms by it definition
      </p>
      <p>So please what mode do you want:</p>
      <div className="flex gap-4">
        <button
          onClick={() => onModeSelect(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Term → Definition
        </button>
        <button
          onClick={() => onModeSelect(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Definition → Term
        </button>
      </div>
    </div>
  );
}
