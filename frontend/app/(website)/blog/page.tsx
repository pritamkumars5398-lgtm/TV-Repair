import type { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog & Insights — Inchell Corparation',
  description: 'Stay updated with the latest industry trends, technical insights, and company news from Inchell Corparation.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}
