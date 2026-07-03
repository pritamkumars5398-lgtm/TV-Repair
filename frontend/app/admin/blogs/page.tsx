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
  
  // Filter blogs based on selected category
  const blogs = filterCategory === 'All' 
    ? allBlogs 
    : allBlogs.filter((b: any) => b.category === filterCategory);

  // Get unique categories for the filter dropdown
  const uniqueCategories = ['All', ...Array.from(new Set(allBlogs.map((b: any) => b.category)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Blog Management</h1>
          <p className="text-sm text-slate-500">Manage your website's blog posts.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            {uniqueCategories.map((cat: any) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add New Blog
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10">No blogs found.</td></tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{blog.title}</td>
                  <td className="px-6 py-4">{blog.category}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => saveMutation.mutate({ ...blog, status: blog.status === 'APPROVED' ? 'DRAFT' : 'APPROVED' })}
                      disabled={saveMutation.isPending}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${blog.status === 'APPROVED' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                      title="Click to toggle status"
                    >
                      {blog.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-800 p-2"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => deleteMutation.mutate(blog.id)} className="text-red-600 hover:text-red-800 p-2"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editingBlog ? 'Edit Blog' : 'New Blog'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (optional)</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-slate-500" placeholder="auto-generated-if-empty" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full border rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea required rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border rounded-lg px-3 py-2"></textarea>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="border rounded-lg px-3 py-2">
                    <option value="DRAFT">Draft</option>
                    <option value="APPROVED">Approved (Publish)</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded border-slate-300" />
                  Featured Post
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
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
