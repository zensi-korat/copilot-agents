import React, { useEffect, useRef, useState } from "react";
import { Check, PlusCircle, FileText } from "lucide-react";
import { Modal } from "../components/Modal";
import {
  TextInput,
  TextArea,
  Select,
  AvatarUploader,
  TagInput,
  PermissionsMatrix,
  FormCard,
} from "../components/forms";
import {
  validateEmail,
  generateIdFromTime,
  parseCSV,
} from "../utils/form-utils";
import {
  DEFAULT_PERMISSIONS,
  COUNTRIES,
  LOCAL_STORAGE_KEY,
} from "../utils/constants";

/**
 * AddUserModal - Modal form component for adding new users
 * Refactored from ~950 lines to ~280 lines using extracted components
 */

export type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "User";
  status: "Active" | "Inactive";
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  country?: string;
  tags?: string[];
  permissions?: string[];
  createdAt?: string;
  bio?: string;
};

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: User) => void;
  nextId?: number;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
  nextId,
}: AddUserModalProps) {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("User");
  const [status, setStatus] = useState<User["status"]>("Active");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState("");

  // UI state
  const [saving, setSaving] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const fileImportRef = useRef<HTMLInputElement | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setName("");
        setEmail("");
        setRole("User");
        setStatus("Active");
        setPhone("");
        setCity("");
        setCountry(COUNTRIES[0]);
        setAddress("");
        setTags([]);
        setPermissions([]);
        setAvatar(undefined);
        setBio("");
        setErrorMap({});
        setSaving(false);
      }, 0);
    }
  }, [isOpen]);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!validateEmail(email)) errors.email = "Invalid email address";
    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  }

  function createUser(overrides?: Partial<User>): User {
    const id = overrides?.id ?? nextId ?? generateIdFromTime();
    return {
      id,
      name: name.trim(),
      email: email.trim(),
      role,
      status,
      phone: phone.trim() || undefined,
      avatar: avatar || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      country: country || undefined,
      tags: tags.length ? tags : undefined,
      permissions: permissions.length ? permissions : undefined,
      createdAt: new Date().toISOString(),
      bio: bio.trim() || undefined,
      ...overrides,
    };
  }

  function persistUser(user: User) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const arr: User[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([user, ...arr]));
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const newUser = createUser();
      onAdd(newUser);
      persistUser(newUser);
      setTimeout(() => {
        setSaving(false);
        onClose();
      }, 300);
    } catch (err) {
      setSaving(false);
      setErrorMap({ form: "Failed to add user. Please try again." });
    }
  }

  function handleSaveAddAnother() {
    if (!validate()) return;
    const newUser = createUser();
    onAdd(newUser);
    persistUser(newUser);
    // Reset form for next entry
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setTags([]);
    setAvatar(undefined);
    setBio("");
  }

  async function handleCSVImport(file: File | null) {
    if (!file) return;
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const imported: User[] = rows.map((r, i) => {
        const id = generateIdFromTime() + i;
        return createUser({
          id,
          name: r.name || r.fullname || r.username || `Imported ${i}`,
          email: r.email || `imported-${id}@example.com`,
          role: (r.role as any) || "User",
          status: (r.status as any) || "Active",
          phone: r.phone || undefined,
          city: r.city || undefined,
          country: r.country || undefined,
          address: r.address || undefined,
          tags: r.tags
            ? r.tags.split(";").map((s: string) => s.trim())
            : undefined,
          permissions: r.permissions
            ? r.permissions.split(";").map((s: string) => s.trim())
            : undefined,
        });
      });

      for (const u of imported) {
        onAdd(u);
        persistUser(u);
      }

      if (fileImportRef.current) fileImportRef.current.value = "";
    } catch (err) {
      setErrorMap({ import: "Failed to import CSV" });
    }
  }

  return (
    <Modal isOpen={isOpen} title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main form fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errorMap.name}
              />
              <TextInput
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errorMap.email}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Role"
                value={role}
                onChange={(v) => setRole(v as any)}
                options={["User", "Manager", "Admin"]}
              />
              <Select
                label="Status"
                value={status}
                onChange={(v) => setStatus(v as any)}
                options={["Active", "Inactive"]}
              />
              <TextInput
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Select
                label="Country"
                value={country}
                onChange={(v) => setCountry(v)}
                options={COUNTRIES}
              />
            </div>

            <TextArea
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextArea
                label="Short Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
              <div>
                <AvatarUploader value={avatar} onChange={(d) => setAvatar(d)} />
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setName("Demo User");
                      setEmail(
                        `demo+${Math.floor(Math.random() * 10000)}@example.com`,
                      );
                      setRole(
                        (Math.random() > 0.7
                          ? "Admin"
                          : Math.random() > 0.4
                            ? "Manager"
                            : "User") as User["role"],
                      );
                      setStatus("Active");
                      setPhone("+1 555 555 555");
                      setCity("San Francisco");
                      setCountry("United States");
                      setAddress("123 Demo St");
                      setTags(["demo", "test"]);
                      setPermissions([DEFAULT_PERMISSIONS[0]]);
                      setBio("This is a demo user created for testing.");
                    }}
                    className="px-3 py-2 bg-gray-100 rounded-md text-sm"
                  >
                    <FileText size={14} /> Fill Demo
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAvatar(
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' font-size='18' text-anchor='middle' fill='%23737474' dy='.3em'>avatar</text></svg>",
                      )
                    }
                    className="px-3 py-2 bg-gray-100 rounded-md text-sm"
                  >
                    Quick Avatar
                  </button>
                </div>
              </div>
            </div>

            <TagInput tags={tags} onChange={setTags} />
          </div>

          {/* Right: Sidebar sections */}
          <div className="lg:col-span-1 space-y-4">
            <FormCard>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Permissions</h4>
                <button
                  type="button"
                  onClick={() => setPermissions(DEFAULT_PERMISSIONS.slice())}
                  className="text-sm text-primary-600"
                >
                  Select All
                </button>
              </div>
              <div className="mt-3">
                <PermissionsMatrix
                  permissions={permissions}
                  onChange={setPermissions}
                />
              </div>
            </FormCard>

            <FormCard>
              <h4 className="font-medium">Import / Bulk Add</h4>
              <p className="text-sm text-gray-500 mt-1">
                Import from CSV or add sample users for testing.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <input
                  ref={fileImportRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleCSVImport(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileImportRef.current?.click()}
                  className="px-3 py-2 bg-gray-100 rounded-md text-sm"
                >
                  <FileText size={14} /> Import CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < 3; i++) {
                      const demo = createUser({
                        id: generateIdFromTime() + i,
                        name: `Sample ${Math.floor(Math.random() * 10000)}`,
                        email: `sample.${Math.floor(Math.random() * 10000)}@example.com`,
                      });
                      onAdd(demo);
                      persistUser(demo);
                    }
                  }}
                  className="px-3 py-2 bg-gray-100 rounded-md text-sm"
                >
                  <PlusCircle size={14} /> Bulk Add 3
                </button>
              </div>
            </FormCard>
          </div>
        </div>

        {errorMap.form && (
          <p className="text-sm text-red-600">{errorMap.form}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAddAnother}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Save & Add Another
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-md flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Saving
              </>
            ) : (
              <>
                <Check size={16} /> Save User
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
