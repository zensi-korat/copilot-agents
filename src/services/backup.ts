import { getToken } from "../utils/token";
import { ApiError } from "../utils/apiClient";

const BASE_URL = "/api";

export type BackupMeta = {
  backup_date: string;
  file_size: number;
  created_at: string;
};

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error ?? `Request failed: ${res.status}`,
    );
  }
  return data as T;
}

export async function uploadBackup(
  payload: unknown,
): Promise<{ message: string; backup_date: string; file_size: number }> {
  const res = await fetch(`${BASE_URL}/backup/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getLatestBackup<T = unknown>(): Promise<T> {
  const res = await fetch(`${BASE_URL}/backup/latest`, {
    headers: authHeaders(),
  });
  return handleResponse<T>(res);
}

export async function listBackups(): Promise<BackupMeta[]> {
  const res = await fetch(`${BASE_URL}/backup/list`, {
    headers: authHeaders(),
  });
  const data = await handleResponse<{ backups: BackupMeta[] }>(res);
  return data.backups;
}

export async function getBackupByDate<T = unknown>(date: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/backup/${encodeURIComponent(date)}`, {
    headers: authHeaders(),
  });
  return handleResponse<T>(res);
}

export async function deleteBackup(date: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/backup/${encodeURIComponent(date)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleResponse(res);
}
