"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ROLE_TYPES } from "./types";

interface RoleTypePickerProps {
  selected: string[];
  onChange: (next: string[]) => void;
}

export function RoleTypePicker({ selected, onChange }: RoleTypePickerProps) {
  function handleChange(value: string, checked: boolean) {
    if (checked) {
      onChange([...selected, value]);
    } else {
      onChange(selected.filter((v) => v !== value));
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">
        Tipo de rol (puedes elegir varios)
      </p>
      <div className="flex flex-wrap gap-4">
        {ROLE_TYPES.map((r) => (
          <label
            key={r.value}
            className="flex items-center gap-2 cursor-pointer text-sm text-slate-700"
          >
            <Checkbox
              checked={selected.includes(r.value)}
              onCheckedChange={(checked) =>
                handleChange(r.value, checked === true)
              }
            />
            {r.label}
          </label>
        ))}
      </div>
    </div>
  );
}
