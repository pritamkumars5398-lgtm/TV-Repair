'use client';

import { useState } from 'react';
import { Search, Package, AlertTriangle, Plus, Minus, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin';
import type { InventoryItem } from '@/types';

const STATUS_CONFIG = {
  IN_STOCK:     { label: 'In Stock',     color: 'bg-green-100 text-green-700' },
  LOW_STOCK:    { label: 'Low Stock',    color: 'bg-yellow-100 text-yellow-700' },
  OUT_OF_STOCK: { label: 'Out of Stock', color: 'bg-red-100 text-red-700' },
};

export default function AdminInventoryPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [adjusting, setAdjusting] = useState<{ id: string; type: 'IN' | 'OUT' } | null>(null);
  const [qty, setQty] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory', search],
    queryFn: () => adminApi.getInventory({ search: search || undefined }).then((r) => r.data),
  });

  const stockMutation = useMutation({
    mutationFn: ({ id, type, quantity }: { id: string; type: 'IN' | 'OUT'; quantity: number }) =>
      adminApi.updateStock(id, { quantity, type }),
    onSuccess: () => {
      toast.success('Stock updated');
      setAdjusting(null);
      setQty('');
      qc.invalidateQueries({ queryKey: ['admin-inventory'] });
    },
    onError: () => toast.error('Stock update failed'),
  });

  const items: InventoryItem[] = data?.items ?? [];
  const lowStockCount = items.filter((i) => i.status !== 'IN_STOCK').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Inventory</h1>
            <p className="text-sm text-slate-500 font-medium">{data?.total ?? 0} items currently tracked</p>
          </div>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl px-5 py-4 shadow-sm animate-in zoom-in-95 duration-500">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <AlertTriangle className="h-5 w-5 shrink-0" />
          </div>
          <p className="text-sm text-red-800 font-bold">
            {lowStockCount} item{lowStockCount > 1 ? 's are' : ' is'} below reorder level — immediate action required.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input type="text" placeholder="Search for parts..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-700 placeholder:text-slate-400" />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 text-left rounded-tl-3xl">Part / Item</th>
                <th className="px-6 py-4 text-left">SKU</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Qty</th>
                <th className="px-6 py-4 text-left">Reorder At</th>
                <th className="px-6 py-4 text-left">Unit Price</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={8} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-500 mx-auto" /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="py-20 text-center">
                  <Package className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No items found matching your criteria.</p>
                </td></tr>
              ) : items.map((item) => (
                <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors group ${item.status !== 'IN_STOCK' ? 'bg-red-50/20 hover:bg-red-50/40' : ''}`}>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{item.sku}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 font-black text-slate-900 text-lg">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{item.reorderLevel}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-full ${STATUS_CONFIG[item.status].color}`}>
                      {STATUS_CONFIG[item.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setAdjusting({ id: item.id, type: 'IN' }); setQty(''); }}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 transition-all" title="Stock In">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setAdjusting({ id: item.id, type: 'OUT' }); setQty(''); }}
                        className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 hover:scale-105 transition-all" title="Stock Out">
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock adjustment inline modal */}
      {adjusting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-5">
            <h2 className="text-xl font-bold text-slate-800">Stock {adjusting.type === 'IN' ? 'In' : 'Out'}</h2>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Quantity</label>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)}
                placeholder="Enter quantity"
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-800" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setAdjusting(null)} className="px-5 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={() => stockMutation.mutate({ id: adjusting.id, type: adjusting.type, quantity: parseInt(qty) })}
                disabled={!qty || stockMutation.isPending}
                className={`flex-1 flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl disabled:opacity-60 transition-all shadow-lg ${adjusting.type === 'IN' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-500 to-red-500 shadow-rose-500/20'}`}>
                {stockMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : `Confirm ${adjusting.type}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
