'use client';

import { useState } from 'react';
import { Plus, X, Loader2, Star, CheckCircle2, XCircle, Wrench } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';
import type { Technician } from '@/types';

export default function AdminTechniciansPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', specialization: '', photo: '' });
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-technicians'],
    queryFn: () => adminApi.getTechnicians().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createTechnician(form),
    onSuccess: () => {
      toast.success('Technician added');
      setShowModal(false);
      setForm({ name: '', phone: '', email: '', specialization: '', photo: '' });
      qc.invalidateQueries({ queryKey: ['admin-technicians'] });
    },
    onError: () => toast.error('Failed to add technician'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.updateTechnician(id, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-technicians'] }),
    onError: () => toast.error('Update failed'),
  });

  const technicians: Technician[] = data?.items ?? [];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl text-white shadow-sm shrink-0">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Technicians</h1>
            <p className="text-xs text-slate-400 font-semibold">{technicians.length} active technicians on the field</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all">
          <Plus className="h-4 w-4" /> Add Technician
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {technicians.map((tech) => (
            <div key={tech.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 hover:border-cyan-250 hover:shadow transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  {tech.photo ? (
                    <img src={tech.photo} alt={tech.name} className="h-10 w-10 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-50 to-primary-50 text-cyan-700 flex items-center justify-center font-bold text-base border border-cyan-100 shadow-sm group-hover:scale-105 transition-transform">
                      {tech.name[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-850 text-xs leading-tight group-hover:text-cyan-700 transition-colors">{tech.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">{tech.specialization}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleMutation.mutate({ id: tech.id, isActive: !tech.isActive })}
                  className={`shrink-0 p-1 rounded-full ${tech.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'} transition-all`}
                  title={tech.isActive ? 'Deactivate' : 'Activate'}
                >
                  {tech.isActive ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </button>
              </div>
              <div className="space-y-1 text-xs text-slate-500 mb-4 font-semibold">
                <p className="flex items-center gap-1.5"><span className="text-slate-400">📞</span> {tech.phone}</p>
                {tech.email && <p className="flex items-center gap-1.5"><span className="text-slate-400">✉️</span> {tech.email}</p>}
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 text-xs">{tech.jobsCompleted}</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Jobs</span>
                </div>
                {tech.rating && (
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-0.5 font-bold text-amber-500">
                      {tech.rating.toFixed(1)} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Rating</span>
                  </div>
                )}
                <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${tech.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                  {tech.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Add Technician</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 space-y-4">
              {([
                { field: 'name', label: 'Full Name', type: 'text' },
                { field: 'phone', label: 'Phone', type: 'tel' },
                { field: 'email', label: 'Email (optional)', type: 'email' },
                { field: 'specialization', label: 'Specialization', type: 'text' },
              ] as { field: keyof typeof form; label: string; type: string }[]).map(({ field, label, type }) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
                  <input type={type} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-medium" />
                </div>
              ))}
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Photo</label>
                <input type="file" accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploading(true);
                    const formData = new FormData();
                    formData.append('image', file);
                    try {
                      const res = await adminApi.uploadImage(formData);
                      if (res.success) {
                        setForm((f) => ({ ...f, photo: res.imageUrl }));
                        toast.success('Image uploaded');
                      }
                    } catch (err) {
                      toast.error('Failed to upload image');
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
                {isUploading && <p className="text-[10px] text-cyan-600 font-semibold mt-1 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</p>}
                {form.photo && !isUploading && <img src={form.photo} alt="Preview" className="h-10 w-10 mt-2 rounded-lg object-cover border border-slate-200" />}
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || isUploading || !form.name || !form.phone}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-bold py-2 rounded-lg shadow-sm transition-all disabled:opacity-60">
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Technician'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
