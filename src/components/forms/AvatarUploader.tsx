import React, { useRef } from "react";
import { UploadCloud, Trash2, Camera } from "lucide-react";
import { FieldLabel } from "./FieldLabel";
import { readFileAsDataURL } from "../../utils/form-utils";

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
        <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">
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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
            >
              <UploadCloud size={16} /> Upload
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md flex items-center gap-2"
            >
              <Trash2 size={16} /> Remove
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Square images work best. Max ~2MB recommended.
          </p>
        </div>
      </div>
    </div>
  );
}
