import { useEffect, useState } from "react";
import { User, Lock, Trash2, Save, AlertTriangle } from "lucide-react";
import { getProfile, updateProfile } from "../../services/user";
import type { UserProfile } from "../../services/user";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../services/user";

export default function ProfilePage() {
  const { user, setAuth, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadError, setLoadError] = useState("");

  // Name form
  const [name, setName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState("");
  const [nameError, setNameError] = useState("");

  // Password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  // Delete account
  const [deletePw, setDeletePw] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        setName(p.name);
      })
      .catch((err) =>
        setLoadError(
          err instanceof ApiError ? err.message : "Could not load profile.",
        ),
      );
  }, []);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Name cannot be empty.");
      return;
    }
    setNameError("");
    setNameMsg("");
    setNameLoading(true);
    try {
      const updated = await updateProfile({ name });
      setProfile((p) => (p ? { ...p, name: updated.name } : p));
      setAuth(
        { id: updated.id, name: updated.name, email: updated.email },
        user?.email ? "" : "",
      );
      setNameMsg("Name updated successfully.");
    } catch (err) {
      setNameError(err instanceof ApiError ? err.message : "Update failed.");
    } finally {
      setNameLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPwError("");
    setPwMsg("");
    setPwLoading(true);
    try {
      await updateProfile({ current_password: currentPw, new_password: newPw });
      setPwMsg("Password changed successfully.");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      setPwError(
        err instanceof ApiError ? err.message : "Password change failed.",
      );
    } finally {
      setPwLoading(false);
    }
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteAccount(deletePw);
      logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : "Could not delete account.",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loadError) {
    return (
      <div className="p-8">
        <p className="text-destructive">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Profile</h1>

      {/* Profile info */}
      {profile && (
        <div className="bg-surface rounded-xl border border-border shadow-sm p-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-foreground text-lg">
              {profile.name}
            </p>
            <p className="text-sm text-muted">{profile.email}</p>
            <p className="text-xs text-muted mt-0.5">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Update name */}
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-muted" />
          <h2 className="font-semibold text-foreground">Update Name</h2>
        </div>
        <form onSubmit={handleUpdateName} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Display name"
          />
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
          {nameMsg && <p className="text-sm text-success">{nameMsg}</p>}
          <button
            type="submit"
            disabled={nameLoading}
            className="flex items-center gap-2 bg-primary hover:opacity-90 disabled:opacity-60 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={15} /> {nameLoading ? "Saving…" : "Save Name"}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-muted" />
          <h2 className="font-semibold text-foreground">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Current password"
          />
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="New password (min 8 chars)"
          />
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Confirm new password"
          />
          {pwError && <p className="text-sm text-destructive">{pwError}</p>}
          {pwMsg && <p className="text-sm text-success">{pwMsg}</p>}
          <button
            type="submit"
            disabled={pwLoading}
            className="flex items-center gap-2 bg-primary hover:opacity-90 disabled:opacity-60 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Lock size={15} /> {pwLoading ? "Changing…" : "Change Password"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-surface rounded-xl border border-destructive/30 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={18} className="text-destructive" />
          <h2 className="font-semibold text-destructive">Danger Zone</h2>
        </div>
        <p className="text-sm text-muted mb-4">
          Permanently delete your account and all data. This cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 border border-destructive/30 text-destructive hover:bg-destructive/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 size={15} /> Delete Account
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-3">
            <p className="text-sm font-medium text-destructive">
              Enter your password to confirm:
            </p>
            <input
              type="password"
              value={deletePw}
              onChange={(e) => setDeletePw(e.target.value)}
              required
              className="w-full px-3 py-2 border border-destructive/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50"
              placeholder="Your password"
            />
            {deleteError && (
              <p className="text-sm text-destructive">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePw("");
                  setDeleteError("");
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={deleteLoading}
                className="flex-1 bg-destructive hover:opacity-90 disabled:opacity-60 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {deleteLoading ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
