"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Album, AlbumFormState } from "./types";
import { AlbumFormFields } from "./album-form-fields";

interface AlbumEditDialogProps {
  editing: Album | null;
  form: AlbumFormState;
  onChange: (patch: Partial<AlbumFormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  saving: boolean;
  error: string | null;
}

export function AlbumEditDialog({
  editing,
  form,
  onChange,
  onSubmit,
  onClose,
  saving,
  error,
}: AlbumEditDialogProps) {
  return (
    <Dialog open={!!editing} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit item</DialogTitle>
          <DialogDescription>
            Modifica los datos del material.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2" noValidate>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}
          <AlbumFormFields form={form} onChange={onChange} layout="edit" />
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
