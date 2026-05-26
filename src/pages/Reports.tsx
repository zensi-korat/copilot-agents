import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "../components/ui";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UiButton = Button as any;
import { Edit2, Trash2, Plus } from "lucide-react";

type Report = {
  id: number;
  patientName: string;
  reportType: string;
  date: string; // ISO date string
  status: "Pending" | "Completed" | "In Progress";
};

const STORAGE_KEY = "copilot_admin_reports";

const DEFAULT_REPORTS: Report[] = [
  {
    id: 1,
    patientName: "Mary Johnson",
    reportType: "Blood Test",
    date: "2026-05-01",
    status: "Completed",
  },
  {
    id: 2,
    patientName: "Alex Lee",
    reportType: "X-Ray",
    date: "2026-05-12",
    status: "Pending",
  },
  {
    id: 3,
    patientName: "Sam Davis",
    reportType: "MRI",
    date: "2026-05-18",
    status: "In Progress",
  },
  {
    id: 4,
    patientName: "Linda Park",
    reportType: "Ultrasound",
    date: "2026-05-20",
    status: "Completed",
  },
];

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Report[];
    } catch (e) {
      // ignore parse errors
    }
    return DEFAULT_REPORTS;
  });

  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // ignore storage errors in the demo
    }
  }, [reports]);

  // nextId reserved for future use

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
          <p className="text-muted">Manage healthcare reports and results</p>
        </div>
        <UiButton variant="default" onClick={() => navigate("/add-report")}>
          <Plus size={20} /> Add Report
        </UiButton>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Patient
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Report Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-border hover:bg-background transition"
                >
                  <td className="py-3 px-4 text-foreground">
                    {report.patientName}
                  </td>
                  <td className="py-3 px-4 text-muted">
                    {report.reportType}
                  </td>
                  <td className="py-3 px-4 text-muted">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${report.status === "Completed" ? "bg-success/10 text-success" : report.status === "Pending" ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-background rounded transition">
                        <Edit2 size={18} className="text-muted" />
                      </button>
                      <button
                        className="p-2 hover:bg-background rounded transition"
                        onClick={() =>
                          setReports((prev) =>
                            prev.filter((r) => r.id !== report.id),
                          )
                        }
                        title="Delete report"
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td
                    className="py-6 px-4 text-center text-muted"
                    colSpan={5}
                  >
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
