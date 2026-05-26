export type AccountType = "cash" | "bank" | "credit" | "savings" | "investment";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  createdAt: string;
};

export type TransactionType = "income" | "expense" | "transfer";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  accountId: string;
  categoryId: string;
  labels: string[];
  note: string;
  date: string;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
};

export type Label = {
  id: string;
  name: string;
  color: string;
};

export type FinanceSettings = {
  currency: string;
  theme: "light" | "dark";
};

export type FinanceData = {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  labels: Label[];
  settings: FinanceSettings;
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-food",
    name: "Food & Dining",
    type: "expense",
    icon: "🍔",
    color: "#f59e0b",
  },
  {
    id: "cat-transport",
    name: "Transport",
    type: "expense",
    icon: "🚗",
    color: "#3b82f6",
  },
  {
    id: "cat-shopping",
    name: "Shopping",
    type: "expense",
    icon: "🛍️",
    color: "#ec4899",
  },
  {
    id: "cat-bills",
    name: "Bills & Utilities",
    type: "expense",
    icon: "💡",
    color: "#8b5cf6",
  },
  {
    id: "cat-health",
    name: "Health",
    type: "expense",
    icon: "🏥",
    color: "#ef4444",
  },
  {
    id: "cat-entertainment",
    name: "Entertainment",
    type: "expense",
    icon: "🎬",
    color: "#f97316",
  },
  {
    id: "cat-education",
    name: "Education",
    type: "expense",
    icon: "📚",
    color: "#06b6d4",
  },
  {
    id: "cat-salary",
    name: "Salary",
    type: "income",
    icon: "💼",
    color: "#10b981",
  },
  {
    id: "cat-freelance",
    name: "Freelance",
    type: "income",
    icon: "💻",
    color: "#14b8a6",
  },
  {
    id: "cat-investment",
    name: "Investment",
    type: "income",
    icon: "📈",
    color: "#6366f1",
  },
  {
    id: "cat-gift",
    name: "Gift",
    type: "income",
    icon: "🎁",
    color: "#f43f5e",
  },
  {
    id: "cat-other",
    name: "Other",
    type: "expense",
    icon: "📌",
    color: "#6b7280",
  },
];

export const EMPTY_FINANCE_DATA: FinanceData = {
  accounts: [],
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  labels: [],
  settings: { currency: "USD", theme: "light" },
};
