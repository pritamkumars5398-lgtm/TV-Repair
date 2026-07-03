'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { Loader2, Star, MessageSquare } from 'lucide-react';

export default function AdminFeedbackPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-feedback', page],
    queryFn: () => adminApi.getFeedbacks({ page, limit: 20 }),
  });

  const feedbacks = data?.items || [];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Customer Feedback</h1>
        <p className="text-xs text-slate-400 font-semibold">View feedback submitted by customers on the website.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 min-w-[280px]">Message</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></td></tr>
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400 font-semibold">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50 text-slate-300" />
                  No feedback received yet.
                </td>
              </tr>
            ) : (
              feedbacks.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{item.name}</div>
                    {item.email && <div className="text-[10px] text-slate-400 mt-0.5">{item.email}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-600 font-medium whitespace-pre-wrap">{item.message}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400 font-semibold">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
