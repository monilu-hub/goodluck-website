"use client";

type Props = {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
};

export function SizeSelector({ sizes, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          className={`min-w-11 rounded-md border px-3 py-2 text-sm transition ${
            selected === size
              ? "border-ink bg-ink text-surface"
              : "border-border bg-surface text-foreground hover:border-ink"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
