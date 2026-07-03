'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, Wrench, Save, Loader2, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';
import { technicianApi } from '@/lib/api/technician';

export default function TechnicianProfilePage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ name: '', email: '', specialization: '' });

  const { data: stats, isLoading } = useQuery({
    queryKey: ['tech-dashboard'],
    queryFn: () => technicianApi.getDashboard().then((r) => r.data),
  });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name ?? '', email: user.email ?? '', specialization: '' });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: () =>
      fetch('/api/v1/technician/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, email: form.email }),
      }).then((r) => r.json()),
    onSuccess: () => {
      toast.success('Profile updated!');
      qc.invalidateQueries({ queryKey: ['tech-dashboard'] });
    },
    onError: () => toast.error('Failed to update profile.'),
  });

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Your account details and performance summary.</p>
      </div>

      {/* Avatar + stats */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5 flex items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {user?.name?.[0]?.toUpperCase() ?? 'T'}
        </div>
        <div className="flex-1">
          <p className="font-bold text-neutral-900 text-lg">{user?.name}</p>
          <p className="text-sm text-neutral-500">{user?.phone}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-neutral-500">
              <span className="font-semibold text-neutral-800">{stats?.completedToday ?? 0}</span> done today
            </span>
            {stats?.rating && (
              <span className="flex items-center gap-1 text-xs text-yellow-600 font-semibold">
                <Star className="h-3.5 w-3.5 fill-yellow-400" />
                {stats.rating.toFixed(1)} rating
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5 space-y-4">
        <h2 className="font-semibold text-neutral-800">Personal Information</h2>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 mb-1.5">
                <User className="h-3.5 w-3.5" /> Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 mb-1.5">
                <Phone className="h-3.5 w-3.5" /> Mobile Number
              </label>
              <input
                type="text"
                value={user?.phone ?? ''}
                disabled
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-400 cursor-not-allowed"
              />
              <p className="text-xs text-neutral-400 mt-1">Phone number cannot be changed.</p>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 mb-1.5">
                <Mail className="h-3.5 w-3.5" /> Email <span className="text-neutral-400">(optional)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 mb-1.5">
                <Wrench className="h-3.5 w-3.5" /> Specialization
              </label>
              <input
                type="text"
                value={form.specialization}
                onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
                placeholder="e.g. LED TV Repair, Motherboard"
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
}
