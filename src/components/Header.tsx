import { Menu, Bell, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFinance } from "../context/FinanceContext";
import { EMPTY_FINANCE_DATA } from "../types/finance";
import { Button } from "./ui";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { restoreFromBackup } = useFinance();

  function handleLogout() {
    // clear local finance state, remove token and user
    try {
      restoreFromBackup(EMPTY_FINANCE_DATA);
    } catch (e) {
      // ignore if restore isn't available for some reason
    }
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="bg-surface border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-subtle rounded-lg transition"
          >
            <Menu size={24} className="text-muted" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell size={18} className="text-muted" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <SettingsIcon size={18} className="text-muted" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="p-2"
          >
            <LogOut size={18} className="text-muted" />
          </Button>
        </div>
      </div>
    </header>
  );
}
