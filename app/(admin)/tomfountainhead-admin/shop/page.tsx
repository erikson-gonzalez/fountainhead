"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Download, Shirt, Video, Pencil, Trash2, Loader2, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const CATEGORIES = [
  { value: "merch", label: "Merch", icon: Shirt },
  { value: "picks", label: "Signature Picks", icon: Package },
  { value: "courses", label: "Courses", icon: Video },
  { value: "sample-packs", label: "Sample Packs", icon: Download },
] as const;

const DELIVERY_TYPES = [
  { value: "physical", label: "Physical", desc: "Merch, physical picks — requires shipping" },
  { value: "download", label: "Downloadable", desc: "Tabs, sample packs — download after purchase" },
  { value: "stream", label: "Stream", desc: "Courses — viewed in account (portal), not downloaded" },
] as const;

type Product = {
  id: number;
  name: string;
  description: string;
  priceEur: number;
  category: string;
  imageUrl: string | null;
  stock: number | null;
  digital: boolean;
  featured: boolean;
  deliveryType: string | null;
};

const emptyForm = {
  name: "",
  description: "",
  priceEur: "",
  category: "merch",
  imageUrl: "",
  stock: "",
  featured: false,
  deliveryType: "physical" as "physical" | "download" | "stream",
};

export default function AdminShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadProducts = () => {
    adminFetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadProducts(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.priceEur) return;
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        priceEur: parseFloat(form.priceEur) || 0,
        category: form.category,
        imageUrl: form.imageUrl.trim() || null,
        stock: form.deliveryType === "physical" && form.stock ? parseInt(form.stock, 10) : null,
        featured: form.featured,
        deliveryType: form.deliveryType,
        digital: form.deliveryType !== "physical",
      };
      if (editingId) {
        await adminFetch(`/api/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setEditingId(null);
      } else {
        await adminFetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setForm(emptyForm);
      loadProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      priceEur: String(p.priceEur),
      category: p.category,
      imageUrl: p.imageUrl ?? "",
      stock: p.stock != null ? String(p.stock) : "",
      featured: p.featured,
      deliveryType: (p.deliveryType || (p.digital ? "download" : "physical")) as "physical" | "download" | "stream",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deliveryLabel = (dt: string | null, digital: boolean) => {
    if (dt === "physical") return "Physical";
    if (dt === "stream") return "Stream";
    if (dt === "download" || digital) return "Descargable";
    return "Physical";
  };

  const previewProduct = {
    name: form.name || "Product Name",
    description: form.description || "Product description...",
    priceEur: parseFloat(form.priceEur) || 0,
    category: form.category,
    imageUrl: form.imageUrl || null,
    deliveryType: form.deliveryType,
    digital: form.deliveryType !== "physical",
  };

  if (loading) {
    return <div className="text-slate-500">Loading products...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Contenido del Shop</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Physical, downloadable or streaming products (courses in portal).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="bg-white border-slate-200 w-full">
          <CardHeader>
            <CardTitle className="text-slate-900">
              {editingId ? "Edit product" : "New product"}
            </CardTitle>
            <CardDescription>Los cambios se reflejan en /shop</CardDescription>
          </CardHeader>
          <CardContent className="text-slate-900">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Fountainhead Signature Pick — Nylon"
                  className="bg-white text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Product description..."
                  rows={3}
                  className="bg-white text-slate-900 placeholder:text-slate-400 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (€)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.priceEur}
                    onChange={(e) => setForm((f) => ({ ...f, priceEur: e.target.value }))}
                    placeholder="19.99"
                    className="bg-white text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                    <SelectTrigger className="bg-white text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          <span className="flex items-center gap-2">
                            <c.icon className="w-4 h-4" />
                            {c.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Imagen URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="/images/pick-nylon.jpg"
                  className="bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de entrega</Label>
                <Select
                  value={form.deliveryType}
                  onValueChange={(v) => setForm((f) => ({ ...f, deliveryType: v as "physical" | "download" | "stream" }))}
                >
                  <SelectTrigger className="bg-white text-slate-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_TYPES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        <div>
                          <span className="font-medium">{d.label}</span>
                          <span className="text-slate-500 text-xs block">{d.desc}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.deliveryType === "physical" && (
                <div className="space-y-2">
                  <Label>Stock (opcional)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    placeholder="50"
                    className="bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="featured" className="cursor-pointer">Destacado</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? "Update" : "Create"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Visualizer */}
        <Card className="bg-white border-slate-200 w-full">
          <CardHeader>
            <CardTitle className="text-slate-900">Vista previa</CardTitle>
            <CardDescription>Preview as it will appear on /shop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 bg-slate-900 p-6">
              <div className="group flex flex-col bg-slate-800/50 border border-slate-700 rounded-sm overflow-hidden">
                <div className="aspect-[4/5] relative bg-black flex items-center justify-center p-8 overflow-hidden">
                  {previewProduct.imageUrl ? (
                    <img
                      src={previewProduct.imageUrl}
                      alt={previewProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-16 h-16 text-white/10" />
                  )}
                  {previewProduct.deliveryType === "stream" && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
                      Stream (Portal)
                    </div>
                  )}
                  {previewProduct.deliveryType === "download" && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
                      Digital Download
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">
                    {CATEGORIES.find((c) => c.value === previewProduct.category)?.label ?? previewProduct.category}
                  </p>
                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-tight">
                    {previewProduct.name}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">{previewProduct.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-display font-bold text-xl text-white">
                      {formatPrice(previewProduct.priceEur)}
                    </span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90" disabled>
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card className="bg-white border-slate-200 w-full">
        <CardHeader>
          <CardTitle className="text-slate-900">Productos ({products.length})</CardTitle>
          <CardDescription>Edit or delete</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay productos. Crea uno arriba.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 py-2 px-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-slate-900 truncate block">{p.name}</span>
                    <span className="text-xs text-slate-500">
                      {p.category} · {deliveryLabel(p.deliveryType, p.digital)} · {formatPrice(p.priceEur)}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(p)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
