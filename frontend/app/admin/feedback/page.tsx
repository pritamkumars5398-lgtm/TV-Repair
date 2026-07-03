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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Customer Feedback</h1>
        <p className="text-sm text-slate-500">View feedback submitted by customers on the website.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary-500 mx-auto" /></td></tr>
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-slate-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  No feedback received yet.
                </td>
              </tr>
            ) : (
              feedbacks.map((item: any) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    {item.email && <div className="text-xs text-slate-500">{item.email}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 min-w-[300px]">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.message}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
