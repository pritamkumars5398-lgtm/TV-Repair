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

  const allBlogs = data?.items || [];
  
  const blogs = filterCategory === 'All' 
    ? allBlogs 
    : allBlogs.filter((b: any) => b.category === filterCategory);

  const uniqueCategories = ['All', ...Array.from(new Set(allBlogs.map((b: any) => b.category)))];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Blog Management</h1>
          <p className="text-xs text-slate-400 font-semibold">Manage your website's blog posts.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-200 bg-white rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 focus:ring-1 focus:ring-primary-500 outline-none cursor-pointer"
          >
            {uniqueCategories.map((cat: any) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow whitespace-nowrap transition-all"
          >
            <Plus className="h-4 w-4" /> Add New Blog
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-slate-400 font-semibold">No blogs found.</td></tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{blog.title}</td>
                  <td className="px-4 py-3 font-semibold text-slate-500">{blog.category}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => saveMutation.mutate({ ...blog, status: blog.status === 'APPROVED' ? 'DRAFT' : 'APPROVED' })}
                      disabled={saveMutation.isPending}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${blog.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-yellow-50 text-yellow-705 border-yellow-250 hover:bg-yellow-100'}`}
                      title="Click to toggle status"
                    >
                      {blog.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-slate-100 rounded-md"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(blog.id); }} className="text-red-600 hover:text-red-800 p-1.5 hover:bg-slate-100 rounded-md"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-500/20 bg-white font-medium"
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
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded border-slate-350 text-primary-600 focus:ring-primary-500/20" />
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
