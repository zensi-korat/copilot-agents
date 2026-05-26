import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  BarChart2,
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import type { Account, AccountType } from "../../types/finance";

const TYPE_ICONS: Record<AccountType, React.ReactNode> = {
  cash: <Wallet size={18} />,
  bank: <BarChart2 size={18} />,
  credit: <CreditCard size={18} />,
  savings: <PiggyBank size={18} />,
  investment: <TrendingUp size={18} />,
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export default function AccountsPage() {
  const { data, addAccount, updateAccount, deleteAccount } = useFinance();

  const BLANK: Omit<Account, "id" | "createdAt"> = {
    name: "",
    type: "bank",
    balance: 0,
    currency: data.settings.currency,
    color: COLORS[0],
  };

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState<Omit<Account, "id" | "createdAt">>(BLANK);
  const [error, setError] = useState("");

  const totalBalance = data.accounts.reduce((s, a) => s + a.balance, 0);

  const displayCurrency =
    data.accounts.length > 0 &&
    data.accounts.every((a) => a.currency === data.accounts[0].currency)
      ? data.accounts[0].currency
      : data.settings.currency;

  function openAdd() {
    setEditing(null);
    setForm(BLANK);
    setError("");
    setShowForm(true);
  }

  function openEdit(account: Account) {
    setEditing(account);
    setForm({
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      color: account.color,
    });
    setError("");
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (editing) {
      updateAccount(editing.id, form);
    } else {
      addAccount({
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
    }
    setShowForm(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
          <p className="text-muted mt-1">
            Total balance:{" "}
            <span className="font-semibold text-foreground">
              {totalBalance.toLocaleString("en-US", {
                style: "currency",
                currency: displayCurrency,
              })}
            </span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Add Account
        </button>
      </div>

      {data.accounts.length === 0 ? (
        <div className="bg-surface rounded-xl border border-dashed border-border p-16 text-center">
          <Wallet size={40} className="mx-auto text-muted mb-3" />
          <p className="text-muted">No accounts yet. Add your first account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.accounts.map((account) => (
            <div
              key={account.id}
              className="bg-surface rounded-xl shadow-sm border border-border p-5 relative group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground"
                  style={{ backgroundColor: account.color }}
                >
                  {TYPE_ICONS[account.type]}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {account.name}
                  </p>
                  <p className="text-xs text-muted capitalize">
                    {account.type}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {account.balance.toLocaleString("en-US", {
                  style: "currency",
                  currency: account.currency,
                })}
              </p>
              <div className="absolute top-3 right-3 hidden group-hover:flex gap-1">
                <button
                  onClick={() => openEdit(account)}
                  className="p-1.5 hover:bg-background rounded-md transition-colors"
                >
                  <Pencil size={14} className="text-muted" />
                </button>
                <button
                  onClick={() => deleteAccount(account.id)}
                  className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <Trash2 size={14} className="text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {editing ? "Edit Account" : "New Account"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Main Bank Account"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as AccountType })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="bank">Bank</option>
                    <option value="cash">Cash</option>
                    <option value="credit">Credit Card</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>INR</option>
                    <option>JPY</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Opening Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.balance}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      balance: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${form.color === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
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
                  {editing ? "Save Changes" : "Add Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
