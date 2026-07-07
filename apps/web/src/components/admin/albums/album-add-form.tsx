import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import type { AlbumFormState } from "./types";
import { AlbumFormFields } from "./album-form-fields";

interface AlbumAddFormProps {
  form: AlbumFormState;
  onChange: (patch: Partial<AlbumFormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}

export function AlbumAddForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  saving,
  error,
}: AlbumAddFormProps) {
  const handleCancel = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onCancel();
    },
    [onCancel],
  );

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200"
      noValidate
    >
      <h4 className="font-medium text-slate-800">Add item</h4>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <AlbumFormFields form={form} onChange={onChange} layout="add" />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span className="ml-2">Add</span>
        </Button>
        <Button type="button" size="sm" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
