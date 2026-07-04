'use client';

import Link from 'next/link';
import { ArrowRight, Search, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api/public';

const categories = ['All', 'Technology', 'Business', 'Sustainability', 'Manufacturing'];

export default function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: () => publicApi.getBlogs(),
  });

  const defaultRepairImage =
    'https://images.unsplash.com/photo-1514489383739-55b8e387a112?auto=format&fit=crop&w=1200&q=80';
  const defaultRepairText =
    'Expert repair tips and service insights for TVs, appliances, and electronics.';

  const featuredPost = blogs.find((p: any) => p.featured);

  const filteredPosts = blogs.filter((p: any) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch && p.id !== featuredPost?.id;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── Hero / Featured Post ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Insights & <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-orange-300">Perspectives</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Dive into the latest industry trends, technical deep-dives, and company news from Longwell Electronics.
            </p>
          </div>

          {featuredPost && (
            <div data-aos="fade-up" data-aos-delay="100" className="group relative rounded-none overflow-hidden border border-slate-200 bg-white">
              <div className="grid lg:grid-cols-2 gap-0 items-stretch">
                <div className="relative h-64 lg:h-full min-h-[300px] lg:min-h-[400px] overflow-hidden">
                  <img
                    src={featuredPost.imageUrl || defaultRepairImage}
                    alt={featuredPost.title || 'Repair Service'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-slate-50">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-bold uppercase tracking-wider">
                        Featured
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                        {featuredPost.category || 'Repair'}
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p className="text-slate-700 text-lg leading-relaxed mb-8 line-clamp-3">
                      {featuredPost.content || defaultRepairText}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-500">
                    <div className="flex items-center gap-4 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="hidden sm:flex items-center gap-1.5"><Clock className="h-4 w-4" /> {featuredPost.readTime}</span>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-600 text-white hover:bg-primary-500 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Main Blog Section ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16" data-aos="fade-up">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-primary-600/30 shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-primary-600 hover:border-primary-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto min-w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white border border-slate-200 rounded-full py-3 pl-11 pr-5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent  animate-spin mx-auto"></div></div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post: any, index: number) => (
                <div key={post.id} data-aos="fade-up" data-aos-delay={index * 50} className="group flex flex-col bg-white rounded-none border border-slate-200 transition-all duration-300 overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.imageUrl || defaultRepairImage}
                      alt={post.title || 'Repair Blog'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-5 left-5">
                      <span className="bg-slate-900/90 text-white text-xs font-semibold px-4 py-2">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-4">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> {post.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 leading-tight mb-4">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                      {post.content || defaultRepairText}
                    </p>
                    <div className="mt-auto">
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl transition-all">
                        Read article <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200" data-aos="fade-in">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
              <p className="text-slate-500">We couldn't find any articles matching your search criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-6 text-primary-600 font-bold hover:text-primary-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
