"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useAlbums } from "./albums/use-albums";
import { useAddForm, useEditForm } from "./albums/use-album-form";
import { AlbumAddForm } from "./albums/album-add-form";
import { AlbumList } from "./albums/album-list";
import { AlbumEditDialog } from "./albums/album-edit-dialog";

export function AdminAlbums() {
  const { albums, loading, saving, setSaving, loadAlbums, handleDelete } =
    useAlbums();

  const {
    form,
    setForm,
    addError,
    showAddForm,
    setShowAddForm,
    resetAddForm,
    handleAdd,
  } = useAddForm();

  const {
    editForm,
    setEditForm,
    editing,
    editError,
    openEdit,
    closeEdit,
    handleUpdate,
  } = useEditForm();

  const onAddSubmit = useCallback(
    (e: React.FormEvent) => handleAdd(e, loadAlbums, setSaving),
    [handleAdd, loadAlbums, setSaving],
  );

  const onEditSubmit = useCallback(
    (e: React.FormEvent) => handleUpdate(e, loadAlbums, setSaving),
    [handleUpdate, loadAlbums, setSaving],
  );

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-slate-900">Discography</CardTitle>
        <CardDescription>
          Add items (albums or songs) for the Discography page.
          Includes Spotify, Apple Music or YouTube embed, role type and description.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showAddForm ? (
          <Button type="button" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add item
          </Button>
        ) : (
          <AlbumAddForm
            form={form}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            onSubmit={onAddSubmit}
            onCancel={resetAddForm}
            saving={saving}
            error={addError}
          />
        )}

        <AlbumList
          albums={albums}
          loading={loading}
          saving={saving}
          onRefresh={loadAlbums}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </CardContent>

      <AlbumEditDialog
        editing={editing}
        form={editForm}
        onChange={(patch) => setEditForm((prev) => ({ ...prev, ...patch }))}
        onSubmit={onEditSubmit}
        onClose={closeEdit}
        saving={saving}
        error={editError}
      />
    </Card>
  );
}
