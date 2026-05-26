import React from "react";
import { FieldLabel } from "./FieldLabel";
import { DEFAULT_PERMISSIONS } from "../../utils/constants";

interface PermissionsMatrixProps {
  permissions: string[];
  onChange: (p: string[]) => void;
}

/**
 * PermissionsMatrix - Checkbox matrix for permission selection
 */
export function PermissionsMatrix({
  permissions,
  onChange,
}: PermissionsMatrixProps) {
  function toggle(permission: string) {
    if (permissions.includes(permission)) {
      onChange(permissions.filter((p) => p !== permission));
    } else {
      onChange([...permissions, permission]);
    }
  }

  return (
    <div>
      <FieldLabel>Permissions</FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        {DEFAULT_PERMISSIONS.map((p) => (
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
