"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories((prev) => [...prev, cat]);
        setForm({ name: "", description: "", image: "" });
        setShowForm(false);
        toast.success("Category created!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) { setCategories((prev) => prev.filter((c) => c.id !== id)); toast.success("Deleted"); }
      else toast.error("Failed to delete");
    } catch { toast.error("Error"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gold-400 text-white px-4 py-2 text-sm hover:bg-gold-500 transition-colors uppercase tracking-wider">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Category Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury" placeholder="e.g., Men's Perfumes" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-luxury" placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-luxury resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-50">{submitting ? "Saving..." : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="border border-gray-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div>
                  <p className="font-medium text-sm text-gray-900">{cat.name}</p>
                  {cat.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{cat.description}</p>}
                </div>
                <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {categories.length === 0 && <div className="col-span-3 p-8 text-center text-gray-400 text-sm">No categories yet</div>}
          </div>
        )}
      </div>
    </div>
  );
}
