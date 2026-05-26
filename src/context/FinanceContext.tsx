import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  Account,
  Category,
  FinanceData,
  Label,
  Transaction,
} from "../types/finance";
import { EMPTY_FINANCE_DATA } from "../types/finance";
import { getLatestBackup, uploadBackup } from "../services/backup";
import { ApiError } from "../utils/apiClient";
import { useAuth } from "./AuthContext";

type FinanceContextValue = {
  data: FinanceData;
  loading: boolean;
  syncing: boolean;
  lastSyncedAt: Date | null;
  syncError: string | null;
  // Accounts
  addAccount: (account: Account) => void;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  // Transactions
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  // Categories
  addCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  // Labels
  addLabel: (label: Label) => void;
  deleteLabel: (id: string) => void;
  // Manual sync
  syncNow: () => Promise<void>;
  restoreFromBackup: (payload: FinanceData) => void;
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<FinanceData>(EMPTY_FINANCE_DATA);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  // Load latest backup on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    getLatestBackup<FinanceData>()
      .then((backup) => setData({ ...EMPTY_FINANCE_DATA, ...backup }))
      .catch((err) => {
        // 404 means no backup yet — start fresh
        if (!(err instanceof ApiError && err.status === 404)) {
          setSyncError("Could not load backup.");
        }
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Auto-save with debounce whenever data changes (skip first mount)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (!isAuthenticated) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      syncToApi(data);
    }, 2000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [data, isAuthenticated]);

  async function syncToApi(payload: FinanceData) {
    setSyncing(true);
    setSyncError(null);
    try {
      await uploadBackup(payload);
      setLastSyncedAt(new Date());
    } catch {
      setSyncError("Auto-save failed. Changes are saved locally.");
    } finally {
      setSyncing(false);
    }
  }

  const syncNow = useCallback(() => syncToApi(data), [data]);

  function restoreFromBackup(payload: FinanceData) {
    setData({ ...EMPTY_FINANCE_DATA, ...payload });
  }

  // ── Account CRUD ──────────────────────────────────────────────
  function addAccount(account: Account) {
    setData((d) => ({ ...d, accounts: [...d.accounts, account] }));
  }
  function updateAccount(id: string, patch: Partial<Account>) {
    setData((d) => ({
      ...d,
      accounts: d.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }
  function deleteAccount(id: string) {
    setData((d) => ({ ...d, accounts: d.accounts.filter((a) => a.id !== id) }));
  }

  // ── Transaction CRUD ──────────────────────────────────────────
  function addTransaction(tx: Transaction) {
    setData((d) => {
      const accounts = d.accounts.map((a) => {
        if (a.id !== tx.accountId) return a;
        const delta = tx.type === "income" ? tx.amount : -tx.amount;
        return { ...a, balance: a.balance + delta };
      });
      return { ...d, accounts, transactions: [tx, ...d.transactions] };
    });
  }
  function updateTransaction(id: string, patch: Partial<Transaction>) {
    setData((d) => ({
      ...d,
      transactions: d.transactions.map((t) =>
        t.id === id ? { ...t, ...patch } : t,
      ),
    }));
  }
  function deleteTransaction(id: string) {
    setData((d) => {
      const tx = d.transactions.find((t) => t.id === id);
      let accounts = d.accounts;
      if (tx) {
        accounts = d.accounts.map((a) => {
          if (a.id !== tx.accountId) return a;
          const delta = tx.type === "income" ? -tx.amount : tx.amount;
          return { ...a, balance: a.balance + delta };
        });
      }
      return {
        ...d,
        accounts,
        transactions: d.transactions.filter((t) => t.id !== id),
      };
    });
  }

  // ── Category CRUD ─────────────────────────────────────────────
  function addCategory(cat: Category) {
    setData((d) => ({ ...d, categories: [...d.categories, cat] }));
  }
  function deleteCategory(id: string) {
    setData((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.id !== id),
    }));
  }

  // ── Label CRUD ────────────────────────────────────────────────
  function addLabel(label: Label) {
    setData((d) => ({ ...d, labels: [...d.labels, label] }));
  }
  function deleteLabel(id: string) {
    setData((d) => ({ ...d, labels: d.labels.filter((l) => l.id !== id) }));
  }

  return (
    <FinanceContext.Provider
      value={{
        data,
        loading,
        syncing,
        lastSyncedAt,
        syncError,
        addAccount,
        updateAccount,
        deleteAccount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        addLabel,
        deleteLabel,
        syncNow,
        restoreFromBackup,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}
