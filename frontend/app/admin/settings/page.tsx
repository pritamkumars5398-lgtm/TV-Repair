'use client';

import { useState } from 'react';
import { Save, Loader2, Bell, CreditCard, Globe, Shield, Plug, Settings } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'general',       label: 'General',       icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment',       label: 'Payment',        icon: CreditCard },
  { id: 'rbac',          label: 'Roles & Access', icon: Shield },
  { id: 'integrations',  label: 'Integrations',  icon: Plug },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [saving, setSaving] = useState(false);

  const [general, setGeneral] = useState({
    businessName: 'RepairCart',
    phone: '+91 8586887887 / 8586807887',
    email: 'support@repaircart.co.in',
    address: '123 Service Street, Electronics Hub, Mumbai – 400001',
    workingHours: 'Mon–Sat: 9:00 AM – 7:00 PM',
    whatsappNumber: '918586887887',
  });

  const [notifications, setNotifications] = useState({
    smsEnabled: true,
    emailEnabled: true,
    whatsappEnabled: true,
    notifyOnNewLead: true,
    notifyOnStatusChange: true,
    notifyOnPayment: true,
  });

  const [payment, setPayment] = useState({
    razorpayKeyId: '',
    razorpaySecret: '',
    visitFee: '250',
    taxPercent: '18',
  });

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Settings saved');
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl text-white shadow-sm shrink-0">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Settings</h1>
            <p className="text-xs text-slate-400 font-semibold">Configure your business, notifications, and integrations</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Tab list */}
        <nav className="flex lg:flex-col gap-1 w-full lg:w-48 shrink-0 bg-white p-2 rounded-xl border border-slate-200/80 shadow-sm overflow-x-auto lg:overflow-visible hide-scrollbar sticky top-5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left whitespace-nowrap lg:whitespace-normal group ${
                activeTab === id
                  ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${activeTab === id ? 'text-white' : 'text-slate-450 group-hover:text-cyan-505'}`} />
              {label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="flex-1 w-full bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6 animate-in slide-in-from-right-2 duration-200">

          {/* General */}
          {activeTab === 'general' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Business Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {([
                  { key: 'businessName', label: 'Business Name' },
                  { key: 'phone',        label: 'Phone Number' },
                  { key: 'email',        label: 'Email Address' },
                  { key: 'whatsappNumber', label: 'WhatsApp Number' },
                ] as { key: keyof typeof general; label: string }[]).map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
                    <input
                      type="text"
                      value={general[key]}
                      onChange={(e) => setGeneral((g) => ({ ...g, [key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-850"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-505 mb-1">Working Hours</label>
                <input
                  type="text"
                  value={general.workingHours}
                  onChange={(e) => setGeneral((g) => ({ ...g, workingHours: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-850"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-505 mb-1">Address</label>
                <textarea
                  rows={2}
                  value={general.address}
                  onChange={(e) => setGeneral((g) => ({ ...g, address: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-850 resize-none"
                />
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <h2 className="text-sm font-bold text-slate-850 border-b border-slate-100 pb-2">Notification Channels</h2>
              <div className="space-y-3">
                {([
                  { key: 'smsEnabled',             label: 'SMS Notifications',               desc: 'Send OTP and status updates via SMS' },
                  { key: 'emailEnabled',            label: 'Email Notifications',             desc: 'Send invoices and confirmations by email' },
                  { key: 'whatsappEnabled',         label: 'WhatsApp Notifications',          desc: 'Send booking and status updates via WhatsApp' },
                  { key: 'notifyOnNewLead',         label: 'Alert on new lead',               desc: 'Notify admin when a new lead is created' },
                  { key: 'notifyOnStatusChange',    label: 'Alert on ticket status change',   desc: 'Notify customer when repair status updates' },
                  { key: 'notifyOnPayment',         label: 'Alert on payment received',       desc: 'Notify admin when payment is captured' },
                ] as { key: keyof typeof notifications; label: string; desc: string }[]).map(({ key, label, desc }) => (
                  <label key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60 cursor-pointer hover:border-cyan-200 transition-all group">
                    <div>
                      <p className="font-bold text-slate-700 text-xs group-hover:text-cyan-700 transition-colors">{label}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{desc}</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[key]}
                        onChange={(e) => setNotifications((n) => ({ ...n, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Payment */}
          {activeTab === 'payment' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <h2 className="text-sm font-bold text-slate-850 mb-4 border-b border-slate-100 pb-2">Payment Configuration</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Razorpay Key ID</label>
                  <input type="text" value={payment.razorpayKeyId}
                    onChange={(e) => setPayment((p) => ({ ...p, razorpayKeyId: e.target.value }))}
                    placeholder="rzp_live_..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Razorpay Secret</label>
                  <input type="password" value={payment.razorpaySecret}
                    onChange={(e) => setPayment((p) => ({ ...p, razorpaySecret: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-800" />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-550 mb-1">Service Visit Fee (₹)</label>
                  <input type="number" value={payment.visitFee}
                    onChange={(e) => setPayment((p) => ({ ...p, visitFee: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-550 mb-1">GST / Tax (%)</label>
                  <input type="number" value={payment.taxPercent}
                    onChange={(e) => setPayment((p) => ({ ...p, taxPercent: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-slate-850" />
                </div>
              </div>
            </div>
          )}

          {/* RBAC */}
          {activeTab === 'rbac' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <h2 className="text-sm font-bold text-slate-850 border-b border-slate-100 pb-2">Roles & Permissions</h2>
              <div className="bg-slate-50 rounded-lg border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3 text-left">Permission</th>
                        <th className="px-4 py-3 text-center">Admin</th>
                        <th className="px-4 py-3 text-center">Manager</th>
                        <th className="px-4 py-3 text-center">Technician</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { perm: 'View Dashboard',      admin: true, manager: true,  tech: false },
                        { perm: 'Manage Leads',        admin: true, manager: true,  tech: false },
                        { perm: 'Manage Tickets',      admin: true, manager: true,  tech: true },
                        { perm: 'View Inventory',      admin: true, manager: false, tech: false },
                        { perm: 'Manage Payments',     admin: true, manager: false, tech: false },
                        { perm: 'View Reports',        admin: true, manager: true,  tech: false },
                        { perm: 'Edit Settings',       admin: true, manager: false, tech: false },
                        { perm: 'Manage Technicians',  admin: true, manager: false, tech: false },
                      ].map(({ perm, admin, manager, tech }) => (
                        <tr key={perm} className="hover:bg-white transition-colors">
                          <td className="px-4 py-3 text-slate-700 font-bold">{perm}</td>
                          {[admin, manager, tech].map((has, i) => (
                            <td key={i} className="px-4 py-3 text-center">
                              {has ? (
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-150 mx-auto">
                                  <svg className="w-3.5 h-3.5 animate-in zoom-in-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-200 text-slate-400 mx-auto">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center pt-2">Role permissions are enforced on the backend. This is a reference view.</p>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <h2 className="text-sm font-bold text-slate-850 border-b border-slate-100 pb-2">Integrations</h2>
              <div className="space-y-3">
                {[
                  { name: 'Razorpay', desc: 'Payment gateway for bookings and invoices', status: 'Connected', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
                  { name: 'WhatsApp Business API', desc: 'Automated notifications and chatbot', status: 'Not configured', color: 'bg-amber-50 text-amber-700 border border-amber-250' },
                  { name: 'Google Maps', desc: 'Address autocomplete and service area map', status: 'Not configured', color: 'bg-amber-50 text-amber-700 border border-amber-250' },
                  { name: 'Sentry', desc: 'Error monitoring and performance tracking', status: 'Not configured', color: 'bg-slate-50 text-slate-500 border border-slate-200' },
                ].map((item) => (
                  <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200/65 rounded-lg hover:border-cyan-200 hover:shadow-sm transition-all">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                      <p className="text-[10px] font-semibold text-slate-450 mt-0.5">{item.desc}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border shadow-sm w-fit shrink-0 ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          {activeTab !== 'rbac' && activeTab !== 'integrations' && (
            <div className="pt-4 border-t border-slate-150 mt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-60 w-full sm:w-auto"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
