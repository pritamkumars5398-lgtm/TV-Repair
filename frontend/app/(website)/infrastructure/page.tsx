import type { Metadata } from 'next';
import InfrastructurePageClient from './InfrastructurePageClient';

export const metadata: Metadata = {
  title: 'Infrastructure — Longwell Electronics',
  description: 'Explore our 20,000 sq ft state-of-the-art facility featuring Class 1000 and 10000 clean rooms, soaking chambers, and advanced packaging areas.',
};

export default function InfrastructurePage() {
  return <InfrastructurePageClient />;
}
