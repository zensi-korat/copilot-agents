import React from "react";
import { Report } from "../../hooks/useReportForm";

interface PreviewSidebarProps {
  form: {
    patientName: string;
    patientId: string;
    dob: string;
    gender: Report["gender"];
    reportType: string;
    date: string;
    orderingPhysician: string;
    priority: Report["priority"];
    status: Report["status"];
    attachments: any[];
    tests: Report["tests"];
  };
}

/**
 * PreviewSidebar — Displays live preview and summary of report form
 */
export default function PreviewSidebar({ form }: PreviewSidebarProps) {
  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="sticky top-6 space-y-4">
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Preview</h3>
          <div className="text-sm text-gray-700">
            <div className="mb-2">
              <strong>Patient:</strong> {form.patientName || "—"}
            </div>
            <div className="mb-2">
              <strong>Report:</strong> {form.reportType || "—"}
            </div>
            <div className="mb-2">
              <strong>Date:</strong> {form.date || "—"}
            </div>
            <div className="mb-2">
              <strong>Physician:</strong> {form.orderingPhysician || "—"}
            </div>
            <div className="mb-2">
              <strong>Priority:</strong> {form.priority}
            </div>
            <div className="mb-2">
              <strong>Status:</strong> {form.status}
            </div>
          </div>
        </div>

        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <strong>Patient ID:</strong> {form.patientId || "—"}
            </div>
            <div>
              <strong>DOB:</strong> {form.dob || "—"}
            </div>
            <div>
              <strong>Gender:</strong> {form.gender || "—"}
            </div>
            <div>
              <strong>Attachments:</strong> {form.attachments.length}
            </div>
          </div>
        </div>

        <div className="border rounded p-4 bg-white">
          <h3 className="font-semibold mb-2">
            Tests ({(form.tests || []).length})
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            {(form.tests || []).slice(0, 6).map((t) => (
              <div key={t.id} className="flex justify-between">
                <div>{t.name || "—"}</div>
                <div className="text-gray-500">
                  {t.value || ""} {t.unit || ""}
                </div>
              </div>
            ))}
            {(form.tests || []).length > 6 && (
              <div className="text-xs text-gray-500">
                Showing 6 of {form.tests.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
