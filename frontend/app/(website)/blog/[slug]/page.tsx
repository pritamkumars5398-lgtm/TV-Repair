'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api/public';
import { Calendar, Clock, ArrowLeft, Loader2, User } from 'lucide-react';
import Link from 'next/link';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['public-blog', params.slug],
    queryFn: () => publicApi.getBlogBySlug(params.slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 text-center px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Blog not found</h1>
        <p className="text-slate-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700">
          <ArrowLeft className="h-4 w-4" /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 flex items-start justify-center pt-12">
      <div className="w-full max-w-3xl px-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Top image */}
          {blog.imageUrl && (
            <div className="h-64 sm:h-80 md:h-96 w-full overflow-hidden">
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-2">{blog.title}</h1>
                <p className="text-sm text-slate-500">{blog.category} • {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {blog.readTime}</p>
              </div>
              <div className="hidden md:flex items-center">
                <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full shadow-sm">Back to Blogs</Link>
              </div>
            </div>

            <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-primary-600 prose-img:rounded-xl">
              {blog.content.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-6 leading-relaxed text-slate-700 whitespace-pre-wrap">{paragraph}</p>
              ))}
            </article>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /> {blog.author || 'Inchell Team'}</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="md:hidden">
                <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full shadow-sm">Back</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
