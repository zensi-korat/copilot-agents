import React from "react";
import { Button } from "../ui";
const UiButton = Button as any;
import { Plus, Trash2 } from "lucide-react";
import { Report } from "../../hooks/useReportForm";

interface TestResultsSectionProps {
  tests: Report["tests"];
  onAddTest: () => void;
  onUpdateTest: (
    id: string,
    patch: Partial<{
      name: string;
      value?: string;
      unit?: string;
      reference?: string;
    }>,
  ) => void;
  onRemoveTest: (id: string) => void;
}

/**
 * TestResultsSection — Manages test row CRUD UI
 */
export default function TestResultsSection({
  tests,
  onAddTest,
  onUpdateTest,
  onRemoveTest,
}: TestResultsSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Test Results</h2>
      <div className="space-y-3">
        {(tests || []).map((t) => (
          <div
            key={t.id}
            className="border rounded p-3 grid grid-cols-12 gap-3 items-start"
          >
            <div className="col-span-12 md:col-span-5">
              <input
                value={t.name}
                onChange={(e) => onUpdateTest(t.id, { name: e.target.value })}
                placeholder="Test name (e.g. Hemoglobin)"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <input
                value={t.value}
                onChange={(e) => onUpdateTest(t.id, { value: e.target.value })}
                placeholder="Value"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <input
                value={t.unit}
                onChange={(e) => onUpdateTest(t.id, { unit: e.target.value })}
                placeholder="Unit"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-12 md:col-span-2">
              <input
                value={t.reference}
                onChange={(e) =>
                  onUpdateTest(t.id, { reference: e.target.value })
                }
                placeholder="Reference"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-12 md:col-span-1 flex justify-end">
              <button
                onClick={() => onRemoveTest(t.id)}
                className="p-2 hover:bg-background rounded"
              >
                <Trash2 size={16} className="text-destructive" />
              </button>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <UiButton variant="secondary" onClick={onAddTest}>
            <Plus size={16} /> Add Test
          </UiButton>
        </div>
      </div>
    </section>
  );
}
