'use client';

import { useState } from 'react';
import { Save, Loader2, Star, Plus, X, FileEdit } from 'lucide-react';
import { toast } from 'sonner';

const TABS = ['Testimonials', 'Services', 'SEO'] as const;
type Tab = typeof TABS[number];

interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceType: string;
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Testimonials');
  const [saving, setSaving] = useState(false);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: '1', customerName: 'Rajesh Kumar', rating: 5, comment: 'Excellent service! My TV was fixed within 2 hours.', serviceType: 'LED TV Repair' },
    { id: '2', customerName: 'Priya Sharma', rating: 5, comment: 'Very professional technicians and genuine parts used.', serviceType: 'Screen Replacement' },
    { id: '3', customerName: 'Amit Singh', rating: 4, comment: 'Good service, reasonable pricing. Will recommend.', serviceType: 'Smart TV Repair' },
  ]);

  const [seo, setSeo] = useState({
    homeTitle: 'RepairCart — TV Repair & Speaker Manufacturing in Mumbai',
    homeDescription: 'Expert LED & Smart TV repair, screen replacement, and premium speaker manufacturing in Mumbai.',
    contactTitle: 'Contact Us | RepairCart',
    googleMapsEmbed: '',
  });

  const [newTestimonial, setNewTestimonial] = useState({ customerName: '', rating: 5, comment: '', serviceType: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success('Content saved');
  }

  function addTestimonial() {
    if (!newTestimonial.customerName || !newTestimonial.comment) {
      toast.error('Name and comment are required');
      return;
    }
    setTestimonials((t) => [...t, { ...newTestimonial, id: Date.now().toString() }]);
    setNewTestimonial({ customerName: '', rating: 5, comment: '', serviceType: '' });
    setShowAddForm(false);
    toast.success('Testimonial added');
  }

  function removeTestimonial(id: string) {
    setTestimonials((t) => t.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
            <FileEdit className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Website Content</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Manage testimonials, service info, and SEO settings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-1.5 w-fit border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === t ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-8">

        {/* Testimonials */}
        {activeTab === 'Testimonials' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Customer Testimonials</h2>
              <button onClick={() => setShowAddForm((v) => !v)}
                className="flex items-center gap-2 text-sm bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all font-bold">
                <Plus className="h-4 w-4" /> Add Testimonial
              </button>
            </div>

            {showAddForm && (
              <div className="border border-cyan-100 rounded-2xl p-6 space-y-4 bg-gradient-to-br from-cyan-50/50 to-primary-50/50 mb-6 shadow-inner animate-in zoom-in-95 duration-200">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Customer Name</label>
                    <input type="text" value={newTestimonial.customerName}
                      onChange={(e) => setNewTestimonial((n) => ({ ...n, customerName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Service Type</label>
                    <input type="text" value={newTestimonial.serviceType}
                      onChange={(e) => setNewTestimonial((n) => ({ ...n, serviceType: e.target.value }))}
                      placeholder="e.g. LED TV Repair"
                      className="w-full px-4 py-2.5 bg-white border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm placeholder:text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Rating</label>
                  <select value={newTestimonial.rating}
                    onChange={(e) => setNewTestimonial((n) => ({ ...n, rating: parseInt(e.target.value) }))}
                    className="px-4 py-2.5 bg-white border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm">
                    {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Comment</label>
                  <textarea rows={3} value={newTestimonial.comment}
                    onChange={(e) => setNewTestimonial((n) => ({ ...n, comment: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={addTestimonial} className="bg-cyan-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-600/20">Save Testimonial</button>
                  <button onClick={() => setShowAddForm(false)} className="text-sm font-bold text-slate-500 hover:text-slate-700 px-4 py-2.5 bg-white rounded-xl shadow-sm hover:shadow">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex gap-4 hover:border-cyan-100 hover:shadow-md hover:shadow-cyan-100/50 transition-all group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-slate-800 text-base">{t.customerName}</p>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">{t.serviceType}</span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-slate-600 italic leading-relaxed">&ldquo;{t.comment}&rdquo;</p>
                  </div>
                  <button onClick={() => removeTestimonial(t.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all h-fit opacity-0 group-hover:opacity-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {activeTab === 'Services' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Service Catalog</h2>
            <p className="text-sm text-slate-500 font-medium mb-6">Service names, descriptions, and pricing are managed through the backend API. Edit them from the database or backend admin.</p>
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-6 shadow-inner">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">Current Active Services</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {['LED / Smart TV Repair', 'Motherboard / Power Supply Repair', 'Screen Replacement', 'Backlight Repair', 'Polarizer Change', 'Speaker Manufacturing', 'Audio System Installation', 'Home Theater Setup'].map((s) => (
                  <div key={s} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    <span className="font-medium text-sm text-slate-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'SEO' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-6">SEO & Meta Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Home Page Title</label>
                <input type="text" value={seo.homeTitle}
                  onChange={(e) => setSeo((s) => ({ ...s, homeTitle: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Home Page Description</label>
                <textarea rows={3} value={seo.homeDescription}
                  onChange={(e) => setSeo((s) => ({ ...s, homeDescription: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-800 resize-none" />
              </div>
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Page Title</label>
                <input type="text" value={seo.contactTitle}
                  onChange={(e) => setSeo((s) => ({ ...s, contactTitle: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Google Maps Embed URL</label>
                <input type="text" value={seo.googleMapsEmbed}
                  onChange={(e) => setSeo((s) => ({ ...s, googleMapsEmbed: e.target.value }))}
                  placeholder="https://maps.google.com/maps?..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-800" />
                <p className="text-xs font-medium text-slate-400 mt-2">Paste the Google Maps embed URL to display the map on the contact page.</p>
              </div>
            </div>
          </div>
        )}

        {/* Save */}
        <div className="pt-6 border-t border-slate-100 mt-8">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-60 w-full sm:w-auto">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}
