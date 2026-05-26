import React, { useRef } from "react";
import { UploadCloud, Trash2, Camera } from "lucide-react";
import { FieldLabel } from "./FieldLabel";
import { readFileAsDataURL } from "../../utils/form-utils";
import { Button } from "../ui";

interface AvatarUploaderProps {
  value?: string;
  onChange: (dataUrl?: string) => void;
}

/**
 * AvatarUploader - Avatar upload component with preview
 */
export function AvatarUploader({ value, onChange }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const data = await readFileAsDataURL(file);
      onChange(data);
    } catch (e) {
      // ignore
    }
  }

  return (
    <div>
      <FieldLabel>Avatar</FieldLabel>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-background rounded-full overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted">
              <Camera size={28} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={16} />
              <span className="ml-2">Upload</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onChange(undefined)}
            >
              <Trash2 size={16} />
              <span className="ml-2">Remove</span>
            </Button>
          </div>
          <p className="text-xs text-muted">
            Square images work best. Max ~2MB recommended.
          </p>
        </div>
      </div>
    </div>
  );
}
