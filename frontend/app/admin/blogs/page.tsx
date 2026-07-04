'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: 'Technology',
    imageUrl: '',
    readTime: '5 min read',
    featured: false,
    status: 'DRAFT',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', page],
    queryFn: () => adminApi.getBlogs({ page, limit: 10 }),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => 
      editingBlog ? adminApi.updateBlog(editingBlog.id, data) : adminApi.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      setIsModalOpen(false);
      setEditingBlog(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBlog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      category: blog.category,
      imageUrl: blog.imageUrl || '',
      readTime: blog.readTime,
      featured: blog.featured,
      status: blog.status,
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      category: 'Technology',
      imageUrl: '',
      readTime: '5 min read',
      featured: false,
      status: 'DRAFT',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setImageUploadError(null);
    setIsImageUploading(true);

    try {
      const payload = new FormData();
      payload.append('image', file);
      const response = await adminApi.uploadBlogImage(payload);
      setFormData((prev) => ({ ...prev, imageUrl: response.imageUrl }));
    } catch (error) {
      setImageUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const allBlogs = data?.items || [];
  
  const blogs = filterCategory === 'All' 
    ? allBlogs 
    : allBlogs.filter((b: any) => b.category === filterCategory);

  const uniqueCategories = ['All', ...Array.from(new Set(allBlogs.map((b: any) => b.category)))];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid gap-6 xl:grid-cols-[1.8fr_auto]">
        <div className="rounded-[1rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">Manage posts, upload images, and keep the admin blog table neat and easy to scan.</p>
            </div>
            <button 
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 py3 rounded-xl shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" /> Add New Blog
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Total posts</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{allBlogs.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Drafts</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{allBlogs.filter((item: any) => item.status === 'DRAFT').length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Featured</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{allBlogs.filter((item: any) => item.featured).length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-[0.24em] mb-4">Filter by category</h2>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {uniqueCategories.map((cat: any) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[1rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
          <thead className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 w-12">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400 font-semibold">No blogs found.</td></tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <img src={blog.imageUrl || 'https://images.unsplash.com/photo-1514489383739-55b8e387a112?w=60&h=60&fit=crop'} alt="blog" className="h-10 w-10 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{blog.title}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{blog.category}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => saveMutation.mutate({ ...blog, status: blog.status === 'APPROVED' ? 'DRAFT' : 'APPROVED' })}
                      disabled={saveMutation.isPending}
                      className={`px-2 py-1 rounded text-xs font-semibold border transition-all ${blog.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
                      title="Click to toggle status"
                    >
                      {blog.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleEdit(blog)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition" title="Edit"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(blog.id); }} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4">
            <h2 className="text-sm font-bold text-slate-800 mb-4">{editingBlog ? 'Edit Blog' : 'New Blog'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Slug (optional)</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20 font-medium text-slate-500" placeholder="auto-generated-if-empty" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20 font-medium"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Image URL</label>
                  <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20 font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Upload Image</label>
                <div className="border border-dashed border-slate-300 rounded-lg bg-slate-50 p-3">
                  <label htmlFor="blog-image" className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded cursor-pointer hover:bg-slate-50 transition text-sm font-medium text-slate-700">
                    <Plus className="h-4 w-4" /> Choose file
                  </label>
                  <input
                    id="blog-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                  <p className="text-xs text-slate-500 mt-2">PNG, JPG (Max 1200x800)</p>
                </div>
                {isImageUploading && <p className="mt-1 text-xs text-blue-600">Uploading...</p>}
                {imageUploadError && <p className="mt-1 text-xs text-red-600">{imageUploadError}</p>}
              </div>
              {formData.imageUrl && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Preview</label>
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                    <img src={formData.imageUrl} alt="Blog preview" className="h-40 w-full object-cover" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Content</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20 font-medium resize-none"></textarea>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="border border-slate-200 rounded-lg px-2.5 py-1 bg-white font-semibold text-slate-600 outline-none">
                    <option value="DRAFT">Draft</option>
                    <option value="APPROVED">Approved (Publish)</option>
                  </select>
                </div>
                <label className="flex items-center gap-1.5 font-bold text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500/20" />
                  Featured Post
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold py-2 rounded-lg shadow-sm disabled:opacity-50">
                  {saveMutation.isPending ? 'Saving...' : 'Save Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}