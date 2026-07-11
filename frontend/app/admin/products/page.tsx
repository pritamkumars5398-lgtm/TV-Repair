'use client';

import { useState, useRef } from 'react';
import { Plus, Loader2, Trash2, Edit3, Package, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';
import { publicApi } from '@/lib/api/public';
import Image from 'next/image';

const predefinedCategories = ["Home Theater", "Home Audio", "Commercial", "Subwoofer", "Outdoor", "Studio", "Accessories"];

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    desc: '',
    specs: '',
    price: '',
    img: ''
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: publicApi.getProducts,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createProduct(data),
    onSuccess: () => {
      toast.success('Product created');
      setModalOpen(false);
      resetForm();
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateProduct(data._id || editingId!, data),
    onSuccess: () => {
      toast.success('Product updated');
      setModalOpen(false);
      resetForm();
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted');
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete product'),
  });

  function resetForm() {
    setEditingId(null);
    setIsCustomCategory(false);
    setFormData({ name: '', category: '', desc: '', specs: '', price: '', img: '' });
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setUploadingImage(true);
    try {
      const res = await adminApi.uploadBlogImage(uploadData);
      setFormData(prev => ({ ...prev, img: res.imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  function handleEdit(product: any) {
    setEditingId(product._id);
    if (!predefinedCategories.includes(product.category)) {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
    }
    setFormData({
      name: product.name,
      category: product.category,
      desc: product.desc,
      specs: product.specs.join(', '),
      price: product.price,
      img: product.img
    });
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      ...formData,
      specs: formData.specs.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingId) {
      payload._id = editingId;
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl text-white shadow-sm shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Product Catalog</h1>
            <p className="text-xs text-slate-400 font-semibold">Manage public facing products</p>
          </div>
        </div>
        <button onClick={() => { resetForm(); setModalOpen(true); }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cyan-500 mx-auto" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 text-left">Product Info</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Pricing</th>
                  <th className="px-4 py-3 text-left">Visibility</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p: any) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-100 shadow-sm shrink-0">
                          <Image src={p.img || '/placeholder.png'} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5 max-w-[240px] truncate">{p.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {p.price}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => updateMutation.mutate({ _id: p._id, isApproved: !p.isApproved })} 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${p.isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-250' : 'bg-amber-50 text-amber-600 border-amber-250'}`}
                      >
                        {p.isApproved ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100 hover:bg-primary-600 hover:text-white rounded-lg transition-colors shadow-sm">
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(p._id); }} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-lg transition-colors shadow-sm">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Package className="h-8 w-8 mb-2 opacity-50" />
                        <p className="font-semibold text-slate-500">No products found</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Click "Add Product" to create your first item.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 relative">
            <h2 className="text-sm font-bold text-slate-800 mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Product Name</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                  {isCustomCategory ? (
                    <div className="flex gap-2">
                      <input required autoFocus value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Enter new category" className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20" />
                      <button type="button" onClick={() => { setIsCustomCategory(false); setFormData({...formData, category: ''}) }} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex items-center justify-center">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <select required value={predefinedCategories.includes(formData.category) ? formData.category : (formData.category ? 'other' : '')} onChange={(e) => {
                      if (e.target.value === 'other') {
                        setIsCustomCategory(true);
                        setFormData({...formData, category: ''});
                      } else {
                        setFormData({...formData, category: e.target.value});
                      }
                    }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20 bg-white">
                      <option value="" disabled>Select a category</option>
                      {predefinedCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="other">+ Add New Category</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Price Range</label>
                <input required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹5,000 – ₹9,000" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                <textarea required rows={2} value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Specs (Comma separated)</label>
                <input value={formData.specs} onChange={(e) => setFormData({...formData, specs: e.target.value})} placeholder="e.g. 120W Output, 2.1 Channel, IP54 Rated" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input required value={formData.img} onChange={(e) => setFormData({...formData, img: e.target.value})} placeholder="https://..." className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20" />
                  
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload
                  </button>

                  {formData.img && (
                    <div className="h-8 w-8 shrink-0 rounded-lg overflow-hidden relative border border-slate-200">
                       <Image src={formData.img} alt="Preview" fill className="object-cover" unoptimized />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold py-2 rounded-lg shadow-sm disabled:opacity-60 transition-colors">
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
