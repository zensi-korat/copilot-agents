import { useEffect, useState } from "react";
import {
  Cloud,
  CloudOff,
  Download,
  Trash2,
  Upload,
  RefreshCw,
} from "lucide-react";
import {
  listBackups,
  getBackupByDate,
  deleteBackup,
  uploadBackup,
} from "../../services/backup";
import type { BackupMeta } from "../../services/backup";
import { useFinance } from "../../context/FinanceContext";
import type { FinanceData } from "../../types/finance";
import { ApiError } from "../../utils/apiClient";

export default function BackupsPage() {
  const { data, syncing, lastSyncedAt, syncNow, restoreFromBackup } =
    useFinance();
  const [backups, setBackups] = useState<BackupMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringDate, setRestoringDate] = useState<string | null>(null);
  const [deletingDate, setDeletingDate] = useState<string | null>(null);
  const [uploadingNow, setUploadingNow] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  async function fetchList() {
    setLoading(true);
    setError("");
    try {
      const list = await listBackups();
      setBackups(list);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load backups.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function handleUploadNow() {
    setUploadingNow(true);
    setError("");
    setSuccessMsg("");
    try {
      await uploadBackup(data);
      setSuccessMsg("Backup uploaded successfully.");
      await fetchList();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploadingNow(false);
    }
  }

  async function handleRestore(date: string) {
    setRestoringDate(date);
    setError("");
    setSuccessMsg("");
    try {
      const backup = await getBackupByDate<FinanceData>(date);
      restoreFromBackup(backup);
      setSuccessMsg(`Restored from backup: ${date}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Restore failed.");
    } finally {
      setRestoringDate(null);
    }
  }

  async function handleDelete(date: string) {
    if (!confirm(`Delete backup for ${date}? This cannot be undone.`)) return;
    setDeletingDate(date);
    setError("");
    setSuccessMsg("");
    try {
      await deleteBackup(date);
      setSuccessMsg(`Backup for ${date} deleted.`);
      setBackups((prev) => prev.filter((b) => b.backup_date !== date));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setDeletingDate(null);
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Backups</h1>
          <p className="text-muted mt-1">
            {syncing ? (
              <span className="flex items-center gap-1 text-primary">
                <RefreshCw size={14} className="animate-spin" /> Auto-saving…
              </span>
            ) : lastSyncedAt ? (
              <span className="flex items-center gap-1 text-success">
                <Cloud size={14} /> Last saved{" "}
                {lastSyncedAt.toLocaleTimeString()}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted">
                <CloudOff size={14} /> Not synced yet
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchList}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
          <button
            onClick={handleUploadNow}
            disabled={uploadingNow || syncing}
            className="flex items-center gap-2 bg-primary hover:opacity-90 disabled:opacity-60 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload size={16} /> {uploadingNow ? "Uploading…" : "Backup Now"}
          </button>
        </div>
      </div>

      {(error || successMsg) && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${error ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}
        >
          {error || successMsg}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface rounded-xl border border-border h-16 animate-pulse"
            />
          ))}
        </div>
      ) : backups.length === 0 ? (
        <div className="bg-surface rounded-xl border border-dashed border-border p-16 text-center">
          <Cloud size={40} className="mx-auto text-muted mb-3" />
          <p className="text-muted">
            No backups yet. Click "Backup Now" to create one.
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border shadow-sm divide-y divide-border">
          {backups.map((b) => (
            <div
              key={b.backup_date}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cloud size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{b.backup_date}</p>
                <p className="text-xs text-muted">
                  {b.created_at} · {formatSize(b.file_size)}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleRestore(b.backup_date)}
                  disabled={restoringDate === b.backup_date}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-primary/30 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Download size={13} />{" "}
                  {restoringDate === b.backup_date ? "Restoring…" : "Restore"}
                </button>
                <button
                  onClick={() => handleDelete(b.backup_date)}
                  disabled={deletingDate === b.backup_date}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={13} />{" "}
                  {deletingDate === b.backup_date ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted">
        Backups are stored for 30 days. One backup per day — uploading again on
        the same day overwrites the previous one.
      </p>
    </div>
  );
}
