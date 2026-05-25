import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Sliders, FileText } from "lucide-react";

interface SidebarProps {
  open: boolean;
}

const menuItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Settings", path: "/settings", icon: Sliders },
];

export default function Sidebar({ open }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-sidebar text-white transition-all duration-300 ease-in-out overflow-y-auto`}
    >
      <div className="p-6">
        <div className={`font-bold text-2xl ${!open && "text-center"}`}>
          {open ? "Admin Panel" : "AP"}
        </div>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-3 transition ${
                isActive
                  ? "bg-primary-600 border-l-4 border-primary-400"
                  : "hover:bg-gray-700"
              }`}
            >
              <Icon size={20} />
              {open && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
