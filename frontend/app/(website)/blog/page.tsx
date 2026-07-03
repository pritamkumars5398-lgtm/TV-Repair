import type { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog & Insights — Longwell Electronics',
  description: 'Stay updated with the latest industry trends, technical insights, and company news from Longwell Electronics.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}
