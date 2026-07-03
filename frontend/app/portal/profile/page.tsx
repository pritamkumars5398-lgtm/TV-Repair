'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Save, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customerApi } from '@/lib/api/customer';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function CustomerProfilePage() {
  const qc = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: () => customerApi.getProfile().then((r) => r.data),
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        address: '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () => customerApi.updateProfile({ name: form.name, email: form.email }),
    onSuccess: (data) => {
      toast.success('Profile updated!');
      if (token) setAuth(data.data, token);
      qc.invalidateQueries({ queryKey: ['customer-profile'] });
    },
    onError: () => toast.error('Failed to update profile.'),
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your account details.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
          {form.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{form.name || 'Customer'}</p>
          <p className="text-sm text-neutral-500">Customer Account</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5 space-y-4">
        <h2 className="font-semibold text-neutral-800">Personal Information</h2>

        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary-600" /></div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Full Name</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Mobile Number</span>
              </label>
              <input
                type="text"
                value={form.phone}
                disabled
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-400 cursor-not-allowed"
              />
              <p className="text-xs text-neutral-400 mt-1">Phone number cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email Address</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Address <span className="text-neutral-400">(optional)</span></span>
              </label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Your home / office address"
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
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
