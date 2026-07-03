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
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-bold mb-8 uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Back to Insights
          </Link>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
              {blog.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-2"><User className="h-4 w-4 text-primary-400" /> {blog.author || 'Longwell Team'}</span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary-400" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary-400" /> {blog.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative -mt-12 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 lg:p-16">
          
          {/* Featured Image */}
          {blog.imageUrl && (
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-sm border border-slate-100">
              <img 
                src={blog.imageUrl} 
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-primary-600 prose-img:rounded-xl">
            {/* Split content by double line breaks to create paragraphs if HTML isn't used */}
            {blog.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="mb-6 leading-relaxed text-slate-600 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}
