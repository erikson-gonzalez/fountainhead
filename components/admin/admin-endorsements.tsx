"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseEndorsements, stringifyEndorsements } from "@/utils/endorsements";
import { Plus, Trash2, ExternalLink } from "lucide-react";

export interface EndorsementItem {
  name: string;
  url?: string;
}

interface ArtistFormData {
  endorsements?: string;
  endorsementsSectionTitle?: string;
}

interface AdminEndorsementsProps {
  form: UseFormReturn<ArtistFormData>;
}

export function AdminEndorsements({ form }: AdminEndorsementsProps) {
  const endorsementsRaw = form.watch("endorsements")?.trim() || "";
  const sectionTitle = form.watch("endorsementsSectionTitle")?.trim() || "Official Endorsements";
  const items = parseEndorsements(endorsementsRaw);

  function updateItems(newItems: EndorsementItem[]) {
    form.setValue("endorsements", stringifyEndorsements(newItems), { shouldDirty: true });
  }

  function addItem() {
    updateItems([...items, { name: "", url: "" }]);
  }

  function removeItem(index: number) {
    updateItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: "name" | "url", value: string) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    updateItems(updated);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Section title</label>
        <Input
          value={sectionTitle}
          onChange={(e) => form.setValue("endorsementsSectionTitle", e.target.value, { shouldDirty: true })}
          placeholder="Official Endorsements"
          className="border-slate-200 bg-white text-slate-900 max-w-md"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Marcas / Endorsements</p>
          <Button type="button" variant="outline" size="sm" onClick={addItem} className="admin-visible-btn border-slate-200 font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Add brand
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
            <p className="text-sm text-slate-500 mb-4">No endorsements yet.</p>
            <Button type="button" variant="outline" size="sm" onClick={addItem} className="admin-visible-btn border-slate-200 font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Add first brand
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex gap-3 items-start">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                    {i + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Nombre</label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(i, "name", e.target.value)}
                        placeholder="Aristides Guitars"
                        className="border-slate-200 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        Link
                        {item.url?.trim() && <ExternalLink className="w-3 h-3 text-emerald-500" />}
                      </label>
                      <Input
                        value={item.url || ""}
                        onChange={(e) => updateItem(i, "url", e.target.value)}
                        placeholder="http://..."
                        type="url"
                        className="border-slate-200 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(i)}
                    className="shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50 mt-6"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
