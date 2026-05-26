import React from "react";
import { Trash2 } from "lucide-react";
import { Attachment } from "../../hooks/useReportForm";

interface AttachmentsSectionProps {
  attachments: Attachment[];
  onAddAttachments: (files: FileList | null) => void;
  onRemoveAttachment: (id: string) => void;
}

/**
 * AttachmentsSection — Manages file upload and attachment list
 */
export default function AttachmentsSection({
  attachments,
  onAddAttachments,
  onRemoveAttachment,
}: AttachmentsSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Attachments</h2>
      <div className="mb-3">
        <input
          type="file"
          multiple
          onChange={(e) => onAddAttachments(e.target.files)}
        />
      </div>

      <div className="space-y-2">
        {attachments.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between border rounded px-3 py-2"
          >
            <div className="text-sm text-foreground">{a.name}</div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted">
                {a.size ? `${Math.round(a.size / 1024)} KB` : null}
              </div>
              <button
                onClick={() => onRemoveAttachment(a.id)}
                className="p-1 hover:bg-background rounded"
              >
                <Trash2 size={14} className="text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
