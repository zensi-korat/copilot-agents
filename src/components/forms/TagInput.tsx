import React, { useState } from "react";
import { FieldLabel } from "./FieldLabel";
import { Input, Button } from "../ui";

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
            className="bg-background text-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-muted hover:text-foreground"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="flex-1"
          placeholder="Press Enter to add tag"
        />
        <Button onClick={() => addTag()}>Add</Button>
      </div>
    </div>
  );
}
