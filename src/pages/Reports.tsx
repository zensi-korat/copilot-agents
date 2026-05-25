import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
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

  const nextId = Math.max(0, ...reports.map((r) => r.id)) + 1;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Manage healthcare reports and results</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/add-report")}>
          <Plus size={20} /> Add Report
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Patient
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Report Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-gray-900">
                    {report.patientName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {report.reportType}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${report.status === "Completed" ? "bg-green-100 text-green-700" : report.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition">
                        <Edit2 size={18} className="text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded transition"
                        onClick={() =>
                          setReports((prev) =>
                            prev.filter((r) => r.id !== report.id),
                          )
                        }
                        title="Delete report"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td
                    className="py-6 px-4 text-center text-gray-500"
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
