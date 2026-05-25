import { useEffect, useState } from "react";

export type Attachment = {
  id: string;
  name: string;
  size?: number;
  type?: string;
};

export type Report = {
  id: number;
  patientName: string;
  patientId?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other" | "";
  reportType: string;
  date: string;
  orderingPhysician?: string;
  notes?: string;
  status: "Pending" | "Completed" | "In Progress";
  priority?: "Low" | "Normal" | "High";
  attachments?: Attachment[];
  tests?: Array<{
    id: string;
    name: string;
    value?: string;
    unit?: string;
    reference?: string;
  }>;
  createdAt?: string;
};

const STORAGE_KEY = "copilot_admin_reports";

export function loadReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Report[];
  } catch {
    // ignore
  }
  return [];
}

export function saveReports(reports: Report[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // ignore
  }
}

export function nextIdForReports(reports: Report[]) {
  return Math.max(0, ...reports.map((r) => r.id)) + 1;
}

export function makeId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * useReportForm — Manages all form state, validation, draft persistence
 */
export function useReportForm() {
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<Report["gender"]>("");

  const [reportType, setReportType] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [orderingPhysician, setOrderingPhysician] = useState("");
  const [status, setStatus] = useState<Report["status"]>("Pending");
  const [priority, setPriority] = useState<Report["priority"]>("Normal");
  const [notes, setNotes] = useState("");

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [tests, setTests] = useState<Report["tests"]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load draft on mount
  useEffect(() => {
    try {
      const filesRaw = localStorage.getItem(`${STORAGE_KEY}_draft`);
      if (filesRaw) {
        const parsed = JSON.parse(filesRaw) as Partial<Report>;
        if (parsed.patientName) setPatientName(parsed.patientName);
        if (parsed.patientId) setPatientId(parsed.patientId);
        if (parsed.dob) setDob(parsed.dob);
        if (parsed.gender) setGender(parsed.gender as any);
        if (parsed.reportType) setReportType(parsed.reportType);
        if (parsed.date) setDate(parsed.date);
        if (parsed.orderingPhysician)
          setOrderingPhysician(parsed.orderingPhysician);
        if (parsed.status) setStatus(parsed.status as any);
        if (parsed.priority) setPriority(parsed.priority as any);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.attachments)
          setAttachments(parsed.attachments as Attachment[]);
        if (parsed.tests) setTests(parsed.tests as any);
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    try {
      const draft: Partial<Report> = {
        patientName,
        patientId,
        dob,
        gender,
        reportType,
        date,
        orderingPhysician,
        status,
        priority,
        notes,
        attachments,
        tests,
      };
      localStorage.setItem(`${STORAGE_KEY}_draft`, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [
    patientName,
    patientId,
    dob,
    gender,
    reportType,
    date,
    orderingPhysician,
    status,
    priority,
    notes,
    attachments,
    tests,
  ]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!patientName.trim()) errs.patientName = "Patient name is required";
    if (!reportType.trim()) errs.reportType = "Report type is required";
    if (!date.trim()) errs.date = "Date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function createReport(): Report {
    const existing = loadReports();
    const id = nextIdForReports(existing);
    return {
      id,
      patientName: patientName.trim(),
      patientId: patientId.trim() || undefined,
      dob: dob || undefined,
      gender: gender || undefined,
      reportType: reportType.trim(),
      date: date || new Date().toISOString().slice(0, 10),
      orderingPhysician: orderingPhysician || undefined,
      notes: notes || undefined,
      status: status,
      priority: priority || "Normal",
      attachments: attachments.length ? attachments : undefined,
      tests: tests && tests.length ? tests : undefined,
      createdAt: new Date().toISOString(),
    };
  }

  function saveReport(): Report | null {
    if (!validate()) return null;
    const existing = loadReports();
    const report = createReport();
    saveReports([report, ...existing]);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_draft`);
    } catch {}
    return report;
  }

  function reset() {
    setPatientName("");
    setPatientId("");
    setDob("");
    setGender("");
    setReportType("");
    setDate(new Date().toISOString().slice(0, 10));
    setOrderingPhysician("");
    setStatus("Pending");
    setPriority("Normal");
    setNotes("");
    setAttachments([]);
    setTests([]);
    setErrors({});
  }

  function addAttachmentList(newFiles: FileList | null) {
    if (!newFiles) return;
    const arr = Array.from(newFiles).map((f) => ({
      id: makeId("att"),
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setAttachments((prev) => [...arr, ...prev]);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function addTestRow() {
    setTests((prev) => [
      ...(prev || []),
      { id: makeId("t"), name: "", value: "", unit: "", reference: "" },
    ]);
  }

  function updateTestRow(
    id: string,
    patch: Partial<{
      name: string;
      value?: string;
      unit?: string;
      reference?: string;
    }>,
  ) {
    setTests((prev) =>
      (prev || []).map((t) => (t.id === id ? { ...t, ...patch } : t)),
    );
  }

  function removeTestRow(id: string) {
    setTests((prev) => (prev || []).filter((t) => t.id !== id));
  }

  return {
    patientName,
    setPatientName,
    patientId,
    setPatientId,
    dob,
    setDob,
    gender,
    setGender,
    reportType,
    setReportType,
    date,
    setDate,
    orderingPhysician,
    setOrderingPhysician,
    status,
    setStatus,
    priority,
    setPriority,
    notes,
    setNotes,
    attachments,
    addAttachmentList,
    removeAttachment,
    tests,
    addTestRow,
    updateTestRow,
    removeTestRow,
    errors,
    validate,
    saveReport,
    reset,
  };
}
