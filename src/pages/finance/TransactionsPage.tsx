import { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import type { Transaction, TransactionType } from "../../types/finance";

const BLANK = {
  type: "expense" as TransactionType,
  amount: 0,
  accountId: "",
  categoryId: "",
  labels: [] as string[],
  note: "",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionsPage() {
  const { data, addTransaction, deleteTransaction } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterAccount, setFilterAccount] = useState("all");

  const filtered = data.transactions.filter((t) => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterAccount !== "all" && t.accountId !== filterAccount) return false;
    return true;
  });

  const totalIncome = data.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = data.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const displayCurrency =
    data.accounts.length > 0 &&
    data.accounts.every((a) => a.currency === data.accounts[0].currency)
      ? data.accounts[0].currency
      : data.settings.currency;

  function fmtAmount(n: number, currency?: string) {
    const curr = currency ?? displayCurrency;
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: curr,
    });
  }

  function getCategoryName(id: string) {
    return data.categories.find((c) => c.id === id)?.name ?? "Unknown";
  }
  function getCategoryIcon(id: string) {
    return data.categories.find((c) => c.id === id)?.icon ?? "📌";
  }
  function getAccountName(id: string) {
    return data.accounts.find((a) => a.id === id)?.name ?? "Unknown";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.accountId) {
      setError("Select an account.");
      return;
    }
    if (!form.categoryId) {
      setError("Select a category.");
      return;
    }
    if (form.amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    addTransaction({
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    setForm(BLANK);
    setShowForm(false);
  }

  const expenseCategories = data.categories.filter((c) => c.type === "expense");
  const incomeCategories = data.categories.filter((c) => c.type === "income");
  const visibleCategories =
    form.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted mt-1">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setForm(BLANK);
            setError("");
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-xl border border-border shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <ArrowUpCircle size={22} className="text-success" />
          </div>
          <div>
            <p className="text-sm text-muted">Total Income</p>
            <p className="text-xl font-bold text-success">
              +{fmtAmount(totalIncome)}
            </p>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-destructive/10 rounded-lg">
            <ArrowDownCircle size={22} className="text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted">Total Expenses</p>
            <p className="text-xl font-bold text-destructive">
              -{fmtAmount(totalExpense)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border shadow-sm p-4 mb-4 flex gap-3 flex-wrap items-center">
        <Filter size={16} className="text-muted" />
        <div className="flex gap-2">
          {(["all", "income", "expense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "bg-background text-muted hover:bg-border"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          className="ml-auto px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Accounts</option>
          {data.accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-surface rounded-xl border border-dashed border-border p-16 text-center">
          <p className="text-muted">No transactions found.</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border shadow-sm divide-y divide-border">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-background group transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-lg flex-shrink-0">
                {getCategoryIcon(tx.categoryId)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {getCategoryName(tx.categoryId)}
                </p>
                <p className="text-xs text-muted">
                  {getAccountName(tx.accountId)} · {tx.date}
                  {tx.note ? ` · ${tx.note}` : ""}
                </p>
              </div>
              <p
                className={`font-semibold text-sm flex-shrink-0 ${tx.type === "income" ? "text-success" : "text-destructive"}`}
              >
                {tx.type === "income" ? "+" : "-"}
                {fmtAmount(
                  tx.amount,
                  data.accounts.find((a) => a.id === tx.accountId)?.currency,
                )}
              </p>
              <button
                onClick={() => deleteTransaction(tx.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded-md transition-all"
              >
                <Trash2 size={14} className="text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              New Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type tabs */}
              <div className="flex gap-2 p-1 bg-background rounded-lg">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setForm({ ...form, type: t, categoryId: "" })
                    }
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${form.type === t ? "bg-surface shadow text-foreground" : "text-muted"}`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={form.amount || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Account
                </label>
                <select
                  value={form.accountId}
                  onChange={(e) =>
                    setForm({ ...form, accountId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select account</option>
                  {data.accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select category</option>
                  {visibleCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Note
                  </label>
                  <input
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
