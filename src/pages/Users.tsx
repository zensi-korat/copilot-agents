import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "../components/ui";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UiButton = Button as any;
import { Edit2, Trash2, Plus } from "lucide-react";
import { type User as AddUserType } from "./AddUserPage";

const STORAGE_KEY = "copilot_admin_users";

const DEFAULT_USERS: AddUserType[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Manager",
    status: "Active",
  },
];

export default function Users() {
  const [users, setUsers] = useState<AddUserType[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AddUserType[];
    } catch (e) {
      // ignore parse errors
    }
    return DEFAULT_USERS;
  });

  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore storage errors in the demo
    }
  }, [users]);

  // Local users state is persisted to localStorage; add-user page lives at /add-user

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Users Management
          </h1>
          <p className="text-muted">Manage your system users and permissions</p>
        </div>
        <UiButton variant="default" onClick={() => navigate("/add-user")}>
          <Plus size={20} /> Add User
        </UiButton>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-background transition"
                >
                  <td className="py-3 px-4 text-foreground">{user.name}</td>
                  <td className="py-3 px-4 text-muted">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${user.status === "Active" ? "bg-success/10 text-success" : "bg-background text-foreground"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-background rounded transition">
                        <Edit2 size={18} className="text-muted" />
                      </button>
                      <button
                        className="p-2 hover:bg-background rounded transition"
                        onClick={() =>
                          setUsers((prev) =>
                            prev.filter((u) => u.id !== user.id),
                          )
                        }
                        title="Delete user"
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User is now a full page application at /add-user */}
    </div>
  );
}
