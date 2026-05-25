import React, { useState } from "react";
import { FieldLabel } from "./FieldLabel";

interface TagInputProps {
  tags: string[];
  onChange: (t: string[]) => void;
}

/**
 * TagInput - Tag input component with chip display and add/remove functionality
 */
export function TagInput({ tags, onChange }: TagInputProps) {
  const [text, setText] = useState("");

  function addTag(value?: string) {
    const v = (value ?? text).trim();
    if (!v) return;
    if (tags.includes(v)) {
      setText("");
      return;
    }
    onChange([...tags, v]);
    setText("");
  }

  function removeTag(index: number) {
    const next = tags.slice();
    next.splice(index, 1);
    onChange(next);
  }

  return (
    <div>
      <FieldLabel>Tags</FieldLabel>
      <div className="flex gap-2 flex-wrap mb-2">
        {tags.map((t, i) => (
          <span
            key={t + i}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
          placeholder="Press Enter to add tag"
        />
        <button
          type="button"
          onClick={() => addTag()}
          className="px-3 py-2 bg-primary-600 text-white rounded-md"
        >
          Add
        </button>
      </div>
    </div>
  );
}
