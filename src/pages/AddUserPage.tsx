import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Camera,
  Check,
  PlusCircle,
  FileText,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "../components/ui";

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

const defaultPermissions = [
  "read:users",
  "write:users",
  "delete:users",
  "read:reports",
  "write:settings",
];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
];

const LOCAL_STORAGE_KEY = "copilot_admin_users";

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function generateIdFromTime() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

function parseCSV(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const obj: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) obj[headers[i]] = cells[i] ?? "";
    return obj;
  });
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-foreground mb-1">
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  },
) {
  const { label, error, ...rest } = props;
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <input
        {...rest}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-surface ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  },
) {
  const { label, error, ...rest } = props;
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <textarea
        {...rest}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-surface ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function AvatarUploader({
  value,
  onChange,
}: {
  value?: string;
  onChange: (dataUrl?: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const data = await readFileAsDataURL(file);
      onChange(data);
    } catch (e) {
      // ignore
    }
  }

  return (
    <div>
      <FieldLabel>Avatar</FieldLabel>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-background rounded-full overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted">
              <Camera size={28} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-background hover:bg-border rounded-md flex items-center gap-2"
            >
              <UploadCloud size={16} /> Upload
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md flex items-center gap-2"
            >
              <Trash2 size={16} /> Remove
            </button>
          </div>
          <p className="text-xs text-muted">
            Square images work best. Max ~2MB recommended.
          </p>
        </div>
      </div>
    </div>
  );
}

function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (t: string[]) => void;
}) {
  const [text, setText] = useState("");
  function addTag(value?: string) {
    const v = (value ?? text).trim();
    if (!v) return;
    if (tags.includes(v)) {
      setText("");
      return;
    }
    onChange([...tags, v]);
    setText("");
  }
  function removeTag(index: number) {
    const next = tags.slice();
    next.splice(index, 1);
    onChange(next);
  }
  return (
    <div>
      <FieldLabel>Tags</FieldLabel>
      <div className="flex gap-2 flex-wrap mb-2">
        {tags.map((t, i) => (
          <span
            key={t + i}
            className="bg-background text-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-muted hover:text-foreground"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="flex-1 px-3 py-2 border border-border rounded-md"
          placeholder="Press Enter to add tag"
        />
        <button
          type="button"
          onClick={() => addTag()}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function PermissionsMatrix({
  permissions,
  onChange,
}: {
  permissions: string[];
  onChange: (p: string[]) => void;
}) {
  function toggle(permission: string) {
    if (permissions.includes(permission))
      onChange(permissions.filter((p) => p !== permission));
    else onChange([...permissions, permission]);
  }
  return (
    <div>
      <FieldLabel>Permissions</FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        {defaultPermissions.map((p) => (
          <label key={p} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={permissions.includes(p)}
              onChange={() => toggle(p)}
            />
            <span className="text-sm text-foreground">{p}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function AddUserPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("User");
  const [status, setStatus] = useState<User["status"]>("Active");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(countries[0]);
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const fileImportRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // reset on mount
    setName("");
    setEmail("");
    setRole("User");
    setStatus("Active");
    setPhone("");
    setCity("");
    setCountry(countries[0]);
    setAddress("");
    setTags([]);
    setPermissions([]);
    setAvatar(undefined);
    setBio("");
    setErrorMap({});
    setSaving(false);
  }, []);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!validateEmail(email)) errors.email = "Invalid email address";
    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const id = generateIdFromTime();
      const newUser: User = {
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
      };
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        const arr: User[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify([newUser, ...arr]),
        );
      } catch (err) {
        // ignore
      }
      setSaving(false);
      navigate("/users");
    } catch (err) {
      setSaving(false);
      setErrorMap({ form: "Failed to add user. Please try again." });
    }
  }

  function handleSaveAddAnother() {
    if (!validate()) return;
    const id = generateIdFromTime();
    const newUser: User = {
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
    };
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const arr: User[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([newUser, ...arr]),
      );
    } catch {
      // ignore
    }
    // reset form for next entry
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
        return {
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
          createdAt: new Date().toISOString(),
        };
      });
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        const arr: User[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify([...imported, ...arr]),
        );
      } catch {}
      if (fileImportRef.current) fileImportRef.current.value = "";
      navigate("/users");
    } catch {
      setErrorMap({ import: "Failed to import CSV" });
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <UserPlus size={20} /> Add New User
          </h1>
          <p className="text-sm text-muted mt-1">
            Create a user and return to the users list.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/users")}>
            Cancel
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                options={countries}
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
                <FieldLabel>Avatar & Quick Actions</FieldLabel>
                <div className="flex flex-col gap-3">
                  <AvatarUploader
                    value={avatar}
                    onChange={(d) => setAvatar(d)}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setName("Demo User");
                        setEmail(
                          `demo+${Math.floor(Math.random() * 10000)}@example.com`,
                        );
                        setRole("User");
                        setStatus("Active");
                        setPhone("+1 555 555 555");
                        setCity("San Francisco");
                        setCountry("United States");
                        setAddress("123 Demo St");
                        setTags(["demo", "test"]);
                        setPermissions([defaultPermissions[0]]);
                        setBio("This is a demo user created for testing.");
                      }}
                      className="px-3 py-2 bg-background rounded-md flex items-center gap-2"
                    >
                      <FileText size={16} /> Fill Demo
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAvatar(
                          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' font-size='18' text-anchor='middle' fill='%23737474' dy='.3em'>avatar</text></svg>",
                        )
                      }
                      className="px-3 py-2 bg-background rounded-md flex items-center gap-2"
                    >
                      <Camera size={16} /> Quick Avatar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <TagInput tags={tags} onChange={setTags} />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-surface border border-border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Permissions</h4>
                <button
                  type="button"
                  onClick={() => setPermissions(defaultPermissions.slice())}
                  className="text-sm text-primary"
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
            </div>

            <div className="bg-surface border border-border rounded-lg p-4 shadow-sm">
              <h4 className="font-medium">Import / Bulk Add</h4>
              <p className="text-sm text-muted mt-1">
                Import from CSV or add sample users for testing.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    ref={fileImportRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                      handleCSVImport(e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileImportRef.current?.click()}
                    className="px-3 py-2 bg-background rounded-md flex items-center gap-2"
                  >
                    <FileText size={16} /> Import CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      for (let i = 0; i < 3; i++) {
                        const demo: User = {
                          id: generateIdFromTime() + i,
                          name: `Sample ${Math.floor(Math.random() * 10000)}`,
                          email: `sample.${Math.floor(Math.random() * 10000)}@example.com`,
                          role: "User",
                          status: "Active",
                          createdAt: new Date().toISOString(),
                        };
                        try {
                          const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
                          const arr: User[] = raw ? JSON.parse(raw) : [];
                          localStorage.setItem(
                            LOCAL_STORAGE_KEY,
                            JSON.stringify([demo, ...arr]),
                          );
                        } catch {}
                      }
                      navigate("/users");
                    }}
                    className="px-3 py-2 bg-background rounded-md flex items-center gap-2"
                  >
                    <PlusCircle size={16} /> Bulk Add 3
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <h4 className="font-medium">Metadata</h4>
              <p className="text-sm text-muted mt-1">Created: --</p>
              <p className="text-sm text-muted mt-1">
                Local persistence key: {LOCAL_STORAGE_KEY}
              </p>
            </div>
          </div>
        </div>

        {errorMap.form && (
          <p className="text-sm text-destructive">{errorMap.form}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate("/users")}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={handleSaveAddAnother}
            className="px-4 py-2 bg-border rounded-md"
          >
            Save & Add Another
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center gap-2"
          >
            {saving ? (
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
            ) : (
              <Check size={16} />
            )}{" "}
            Save User
          </button>
        </div>
      </form>
    </div>
  );
}
