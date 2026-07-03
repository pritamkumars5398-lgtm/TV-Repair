'use client';

import { useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp, Plus, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customerApi } from '@/lib/api/customer';
import type { Query } from '@/types';

const STATUS_COLORS = {
  OPEN:        'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED:    'bg-green-100 text-green-700',
};

export default function CustomerQueriesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newQuery, setNewQuery] = useState({ subject: '', message: '' });
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const { data: queries, isLoading } = useQuery({
    queryKey: ['customer-queries'],
    queryFn: () => customerApi.getQueries().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => customerApi.createQuery(newQuery),
    onSuccess: () => {
      toast.success('Query submitted!');
      setNewQuery({ subject: '', message: '' });
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ['customer-queries'] });
    },
    onError: () => toast.error('Failed to submit query.'),
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      customerApi.replyQuery(id, message),
    onSuccess: (_data, { id }) => {
      toast.success('Reply sent!');
      setReplyText((r) => ({ ...r, [id]: '' }));
      qc.invalidateQueries({ queryKey: ['customer-queries'] });
    },
    onError: () => toast.error('Failed to send reply.'),
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">My Queries</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Raise a support query and track responses.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" /> New Query
        </button>
      </div>

      {/* New query form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-5 space-y-4">
          <h2 className="font-semibold text-neutral-800">Raise a New Query</h2>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subject</label>
            <input
              type="text"
              value={newQuery.subject}
              onChange={(e) => setNewQuery((q) => ({ ...q, subject: e.target.value }))}
              placeholder="e.g. Repair delay, Invoice issue..."
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
            <textarea
              rows={4}
              value={newQuery.message}
              onChange={(e) => setNewQuery((q) => ({ ...q, message: e.target.value }))}
              placeholder="Describe your concern in detail..."
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !newQuery.subject || !newQuery.message}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700">Cancel</button>
          </div>
        </div>
      )}

      {/* Queries list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
        ) : !queries?.length ? (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-card p-10 text-center">
            <MessageSquare className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No queries yet. Raise one if you need help!</p>
          </div>
        ) : (
          queries.map((q: Query) => (
            <div key={q.id} className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{q.subject}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{new Date(q.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[q.status]}`}>{q.status.replace('_', ' ')}</span>
                  {expandedId === q.id ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                </div>
              </button>

              {expandedId === q.id && (
                <div className="border-t border-neutral-100 px-5 pb-5">
                  <div className="pt-4 space-y-3">
                    <div className="bg-neutral-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-neutral-400 mb-1">Your message</p>
                      <p className="text-sm text-neutral-700">{q.message}</p>
                    </div>
                    {q.replies?.map((r) => (
                      <div key={r.id} className={`rounded-lg p-3 ${r.isStaff ? 'bg-primary-50 border border-primary-100' : 'bg-neutral-50'}`}>
                        <p className="text-xs font-medium text-neutral-400 mb-1">{r.isStaff ? 'Support Team' : 'You'} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                        <p className="text-sm text-neutral-700">{r.message}</p>
                      </div>
                    ))}
                    {q.status !== 'RESOLVED' && (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Add a reply..."
                          value={replyText[q.id] ?? ''}
                          onChange={(e) => setReplyText((r) => ({ ...r, [q.id]: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          onClick={() => replyMutation.mutate({ id: q.id, message: replyText[q.id] ?? '' })}
                          disabled={!replyText[q.id] || replyMutation.isPending}
                          className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
