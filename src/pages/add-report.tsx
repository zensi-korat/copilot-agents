import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "../components/ui";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UiButton = Button as any;
import { ArrowLeft, Save } from "lucide-react";
import type { Report } from "../hooks/useReportForm";
import { useReportForm } from "../hooks/useReportForm";
import TestResultsSection from "../components/ReportForm/TestResultsSection";
import AttachmentsSection from "../components/ReportForm/AttachmentsSection";
import PreviewSidebar from "../components/ReportForm/PreviewSidebar";

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 items-start mb-4">
      <label className="col-span-12 md:col-span-3 text-sm text-muted pt-2">
        {label}
      </label>
      <div className="col-span-12 md:col-span-9">{children}</div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string | "";
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-border rounded px-3 py-2 bg-surface"
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/**
 * AddReportPage — Form to create and save healthcare reports
 * Refactored: State management extracted to useReportForm hook
 * Section components extracted for TestResults, Attachments, and PreviewSidebar
 */
export default function AddReportPage(): JSX.Element {
  const navigate = useNavigate();
  const form = useReportForm();

  const reportTypes = useMemo(
    () => [
      "Blood Test",
      "X-Ray",
      "MRI",
      "Ultrasound",
      "Pathology",
      "ECG",
      "Histology",
      "Other",
    ],
    [],
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          className="p-2 rounded hover:bg-background"
          onClick={() => navigate(-1)}
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Report</h1>
          <p className="text-muted">
            Create a new healthcare report and attach findings.
          </p>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold mb-3">Patient Details</h2>
                <FieldRow label="Patient Name">
                  <TextInput
                    value={form.patientName}
                    onChange={form.setPatientName}
                    placeholder="e.g. John Doe"
                  />
                  {form.errors.patientName && (
                    <div className="text-destructive text-sm mt-1">
                      {form.errors.patientName}
                    </div>
                  )}
                </FieldRow>

                <FieldRow label="Patient ID">
                  <TextInput
                    value={form.patientId}
                    onChange={form.setPatientId}
                    placeholder="Hospital / MRN"
                  />
                </FieldRow>

                <FieldRow label="Date of Birth">
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => form.setDob(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </FieldRow>

                <FieldRow label="Gender">
                  <SelectInput
                    value={form.gender ?? ""}
                    onChange={(v) =>
                      form.setGender(v as unknown as Report["gender"])
                    }
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                </FieldRow>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Report Details</h2>
                <FieldRow label="Report Type">
                  <SelectInput
                    value={form.reportType ?? ""}
                    onChange={(v) => form.setReportType(v)}
                    options={reportTypes.map((r) => ({ label: r, value: r }))}
                  />
                  {form.errors.reportType && (
                    <div className="text-destructive text-sm mt-1">
                      {form.errors.reportType}
                    </div>
                  )}
                </FieldRow>

                <FieldRow label="Report Date">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => form.setDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {form.errors.date && (
                    <div className="text-destructive text-sm mt-1">
                      {form.errors.date}
                    </div>
                  )}
                </FieldRow>

                <FieldRow label="Ordering Physician">
                  <TextInput
                    value={form.orderingPhysician}
                    onChange={form.setOrderingPhysician}
                    placeholder="Physician name"
                  />
                </FieldRow>

                <FieldRow label="Priority">
                  <SelectInput
                    value={form.priority ?? ""}
                    onChange={(v) =>
                      form.setPriority(v as unknown as Report["priority"])
                    }
                    options={[
                      { label: "Low", value: "Low" },
                      { label: "Normal", value: "Normal" },
                      { label: "High", value: "High" },
                    ]}
                  />
                </FieldRow>

                <FieldRow label="Status">
                  <SelectInput
                    value={form.status ?? ""}
                    onChange={(v) =>
                      form.setStatus(v as unknown as Report["status"])
                    }
                    options={[
                      { label: "Pending", value: "Pending" },
                      { label: "In Progress", value: "In Progress" },
                      { label: "Completed", value: "Completed" },
                    ]}
                  />
                </FieldRow>
              </section>

              <TestResultsSection
                tests={form.tests}
                onAddTest={form.addTestRow}
                onUpdateTest={form.updateTestRow}
                onRemoveTest={form.removeTestRow}
              />

              <AttachmentsSection
                attachments={form.attachments}
                onAddAttachments={form.addAttachmentList}
                onRemoveAttachment={form.removeAttachment}
              />

              <section>
                <h2 className="text-lg font-semibold mb-3">Notes</h2>
                <FieldRow label="Clinical Notes">
                  <textarea
                    value={form.notes}
                    onChange={(e) => form.setNotes(e.target.value)}
                    rows={6}
                    className="w-full border rounded px-3 py-2"
                  />
                </FieldRow>
              </section>

              <div className="flex gap-3">
                <UiButton
                  variant="default"
                  onClick={() => {
                    form.saveReport();
                    navigate("/reports");
                  }}
                >
                  <Save size={16} /> Save Report
                </UiButton>

                <UiButton
                  variant="ghost"
                  onClick={() => {
                    form.saveReport();
                    form.reset();
                  }}
                >
                  Save & New
                </UiButton>

                <UiButton
                  variant="secondary"
                  onClick={() => navigate("/reports")}
                >
                  Cancel
                </UiButton>
              </div>
            </div>
          </div>

          <PreviewSidebar form={form} />
        </div>
      </Card>
    </div>
  );
}
