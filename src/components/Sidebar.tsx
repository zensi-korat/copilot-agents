import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Cloud,
  User,
  Sliders,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui";

interface SidebarProps {
  open: boolean;
}

const menuItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Accounts", path: "/accounts", icon: Wallet },
  { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { label: "Backups", path: "/backups", icon: Cloud },
  { label: "Profile", path: "/profile", icon: User },
  { label: "Settings", path: "/settings", icon: Sliders },
];

export default function Sidebar({ open }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-sidebar text-sidebar-foreground border-r border-border transition-all duration-300 ease-in-out overflow-y-auto flex flex-col`}
    >
      <div className="p-6">
        <div className={`font-bold text-2xl ${!open && "text-center"}`}>
          {open ? "Finio" : "F"}
        </div>
        {open && user && (
          <p className="text-sidebar-muted text-xs mt-1 truncate">
            {user.email}
          </p>
        )}
      </div>

      <nav className="mt-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              asChild
              variant="ghost"
              className={`w-full justify-start ${
                isActive
                  ? "bg-sidebar-active-bg border-l-4 border-primary text-primary font-semibold"
                  : "text-sidebar-muted hover:bg-subtle hover:text-sidebar-foreground"
              }`}
            >
              <Link
                to={item.path}
                className="flex items-center gap-4 px-6 py-3 w-full"
              >
                <Icon size={20} />
                {open && <span>{item.label}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Button
        variant="ghost"
        className="w-full flex items-center gap-4 px-6 py-4 text-sidebar-muted hover:text-destructive hover:bg-subtle"
        onClick={logout}
      >
        <LogOut size={20} />
        {open && <span>Sign Out</span>}
      </Button>
    </aside>
  );
}
