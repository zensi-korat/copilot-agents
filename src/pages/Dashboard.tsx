import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui";
import StatCard from "../components/StatCard";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { data, loading } = useFinance();
  const { user } = useAuth();
  const totalBalance = data.accounts.reduce((s, a) => s + a.balance, 0);
  const totalIncome = data.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = data.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const netSavings = totalIncome - totalExpense;

  const recentTx = data.transactions.slice(0, 6);

  const displayCurrency =
    data.accounts.length > 0 &&
    data.accounts.every((a) => a.currency === data.accounts[0].currency)
      ? data.accounts[0].currency
      : data.settings.currency;

  function fmt(n: number, currency?: string) {
    const curr = currency ?? displayCurrency;
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: curr,
    });
  }

  function getCategoryIcon(id: string) {
    return data.categories.find((c) => c.id === id)?.icon ?? "📌";
  }
  function getCategoryName(id: string) {
    return data.categories.find((c) => c.id === id)?.name ?? "Unknown";
  }
  function getAccountName(id: string) {
    return data.accounts.find((a) => a.id === id)?.name ?? "Unknown";
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted mt-1">Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Balance"
          value={fmt(totalBalance)}
          icon={<Wallet size={24} />}
          trend={totalBalance >= 0 ? "up" : "down"}
          trendValue={`${data.accounts.length} account${data.accounts.length !== 1 ? "s" : ""}`}
        />
        <StatCard
          label="Total Income"
          value={fmt(totalIncome)}
          icon={<TrendingUp size={24} />}
          trend="up"
          trendValue={`${data.transactions.filter((t) => t.type === "income").length} transactions`}
        />
        <StatCard
          label="Total Expenses"
          value={fmt(totalExpense)}
          icon={<TrendingDown size={24} />}
          trend="down"
          trendValue={`${data.transactions.filter((t) => t.type === "expense").length} transactions`}
        />
        <StatCard
          label="Net Savings"
          value={fmt(netSavings)}
          icon={<PiggyBank size={24} />}
          trend={netSavings >= 0 ? "up" : "down"}
          trendValue={netSavings >= 0 ? "Positive cashflow" : "Overspending"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Transactions */}
        <Card title="Recent Transactions" className="lg:col-span-2">
          {recentTx.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted text-sm">No transactions yet.</p>
              <Link
                to="/transactions"
                className="text-primary text-sm hover:underline mt-1 inline-block"
              >
                Add your first transaction →
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentTx.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-subtle flex items-center justify-center text-base flex-shrink-0">
                    {getCategoryIcon(tx.categoryId)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {getCategoryName(tx.categoryId)}
                    </p>
                    <p className="text-xs text-muted">
                      {getAccountName(tx.accountId)} · {tx.date}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold flex-shrink-0 ${tx.type === "income" ? "text-success" : "text-destructive"}`}
                  >
                    {tx.type === "income" ? (
                      <ArrowUpCircle size={14} />
                    ) : (
                      <ArrowDownCircle size={14} />
                    )}
                    {tx.type === "income" ? "+" : "-"}
                    {fmt(tx.amount)}
                  </div>
                </div>
              ))}
              {data.transactions.length > 6 && (
                <Link
                  to="/transactions"
                  className="block text-center text-sm text-primary hover:underline pt-2"
                >
                  View all {data.transactions.length} transactions →
                </Link>
              )}
            </div>
          )}
        </Card>

        {/* Accounts Summary */}
        <Card title="Accounts">
          {data.accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted text-sm">No accounts yet.</p>
              <Link
                to="/accounts"
                className="text-primary text-sm hover:underline mt-1 inline-block"
              >
                Add an account →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.accounts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: a.color }}
                    />
                    <span className="text-sm text-foreground truncate">
                      {a.name}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${a.balance < 0 ? "text-destructive" : "text-foreground"}`}
                  >
                    {a.balance.toLocaleString("en-US", {
                      style: "currency",
                      currency: a.currency,
                    })}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-border flex justify-between">
                <span className="text-sm font-medium text-muted">Total</span>
                <span
                  className={`text-sm font-bold ${totalBalance < 0 ? "text-destructive" : "text-foreground"}`}
                >
                  {fmt(totalBalance)}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Top Spending Categories */}
      <Card title="Top Spending Categories">
        {data.transactions.filter((t) => t.type === "expense").length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            No expense data yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(
              data.transactions
                .filter((t) => t.type === "expense")
                .reduce<Record<string, number>>((acc, t) => {
                  acc[t.categoryId] = (acc[t.categoryId] ?? 0) + t.amount;
                  return acc;
                }, {}),
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([catId, total]) => {
                const cat = data.categories.find((c) => c.id === catId);
                return (
                  <div
                    key={catId}
                    className="text-center p-3 bg-subtle rounded-xl"
                  >
                    <div className="text-2xl mb-1">{cat?.icon ?? "📌"}</div>
                    <p className="text-xs text-muted truncate">
                      {cat?.name ?? "Other"}
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {fmt(total)}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </Card>
    </div>
  );
}
