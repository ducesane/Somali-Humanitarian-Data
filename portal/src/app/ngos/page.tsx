import { Metadata } from 'next';
import { getAllNGOs } from '@/lib/data';
import NgosDirectoryClient from './NgosDirectoryClient';

export const metadata: Metadata = {
  title: 'Somalia National NGOs & Humanitarian Operational Partners (2026)',
  description: 'Track where Somali National NGOs (NNGOs) execute frontline actions across all 90 districts, direct SHF pooled fund allocations, and downstream funding mechanisms.',
};

export default function NGOsDirectoryPage() {
  const ngos = getAllNGOs();

  return <NgosDirectoryClient initialNgos={ngos} />;
}
