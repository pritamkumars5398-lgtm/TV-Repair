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
  const [form, setForm] = useState({ name: '', phone: '', email: '', specialization: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-technicians'],
    queryFn: () => adminApi.getTechnicians().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createTechnician(form),
    onSuccess: () => {
      toast.success('Technician added');
      setShowModal(false);
      setForm({ name: '', phone: '', email: '', specialization: '' });
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Technicians</h1>
            <p className="text-sm text-slate-500 font-medium">{technicians.length} active technicians on the field</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-lg shadow-cyan-500/25 transition-all">
          <Plus className="h-5 w-5" /> Add Technician
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-cyan-500" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {technicians.map((tech) => (
            <div key={tech.id} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 hover:shadow-[0_8px_30px_rgb(6,182,212,0.1)] hover:border-cyan-100 transition-all group">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-50 to-primary-50 text-cyan-700 flex items-center justify-center font-black text-lg border border-cyan-100 shadow-sm shadow-cyan-100/50 group-hover:scale-110 transition-transform">
                    {tech.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg leading-tight group-hover:text-cyan-700 transition-colors">{tech.name}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{tech.specialization}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleMutation.mutate({ id: tech.id, isActive: !tech.isActive })}
                  className={`shrink-0 p-1.5 rounded-full ${tech.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'} transition-all`}
                  title={tech.isActive ? 'Deactivate' : 'Activate'}
                >
                  {tech.isActive ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                </button>
              </div>
              <div className="space-y-1.5 text-sm text-slate-600 mb-5 font-medium">
                <p className="flex items-center gap-2"><span className="w-4 text-center">📞</span> {tech.phone}</p>
                {tech.email && <p className="flex items-center gap-2 text-slate-500"><span className="w-4 text-center">✉️</span> {tech.email}</p>}
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="font-black text-slate-800">{tech.jobsCompleted}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Jobs</span>
                </div>
                {tech.rating && (
                  <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1 font-black text-amber-500">
                      {tech.rating.toFixed(1)} <Star className="h-3 w-3 fill-amber-400" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Rating</span>
                  </div>
                )}
                <span className={`text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-full ${tech.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Add Technician</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              {([
                { field: 'name', label: 'Full Name', type: 'text' },
                { field: 'phone', label: 'Phone', type: 'tel' },
                { field: 'email', label: 'Email (optional)', type: 'email' },
                { field: 'specialization', label: 'Specialization', type: 'text' },
              ] as { field: keyof typeof form; label: string; type: string }[]).map(({ field, label, type }) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
                  <input type={type} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium" />
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="px-5 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.name || !form.phone}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-60">
                  {createMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Add Technician'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
