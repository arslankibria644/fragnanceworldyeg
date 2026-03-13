"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", link: "", isActive: true, order: 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/banners").then((r) => r.json()).then(setBanners).catch(() => setBanners([])).finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result, folder: "luxe-scents/banners" }),
        });
        const data = await res.json();
        if (data.url) setForm((prev) => ({ ...prev, image: data.url }));
      } catch { toast.error("Upload failed"); }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) { toast.error("Title and image are required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const banner = await res.json();
        setBanners((prev) => [...prev, banner]);
        setForm({ title: "", subtitle: "", image: "", link: "", isActive: true, order: 0 });
        setShowForm(false);
        toast.success("Banner created!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await fetch(`/api/banners/${id}`, { method: "DELETE" });
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Error"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gold-400 text-white px-4 py-2 text-sm hover:bg-gold-500 transition-colors">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">New Banner</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-luxury" placeholder="Banner title" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Subtitle</label>
              <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input-luxury" placeholder="Optional subtitle" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Link (Optional)</label>
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-luxury" placeholder="/shop" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="input-luxury" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Banner Image *</label>
              {form.image && <img src={form.image} alt="Preview" className="h-32 object-cover mb-3 rounded" />}
              <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-gold-400 p-4 cursor-pointer transition-colors w-fit">
                <Upload size={18} className="text-gray-400" />
                <span className="text-sm text-gray-500">Upload Image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="bannerActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
              <label htmlFor="bannerActive" className="text-sm">Active</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-50">{submitting ? "Saving..." : "Create Banner"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-3 p-8 text-center text-gray-400">Loading...</div> : banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
            {banner.image && <div className="relative h-40"><Image src={banner.image} alt={banner.title} fill className="object-cover" /></div>}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{banner.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded ${banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {banner.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <button onClick={() => handleDelete(banner.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {!loading && banners.length === 0 && <div className="col-span-3 p-8 text-center text-gray-400">No banners yet</div>}
      </div>
    </div>
  );
}
