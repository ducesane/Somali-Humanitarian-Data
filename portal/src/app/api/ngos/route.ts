import { NextResponse } from 'next/server';
import { getAllNGOs } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const cluster = searchParams.get('cluster');

  let ngos = getAllNGOs();

  if (type) {
    ngos = ngos.filter(
      (n) => n.type.toLowerCase() === type.toLowerCase()
    );
  }

  if (cluster) {
    ngos = ngos.filter(
      (n) => n.clusters_active?.some((c) => c.toLowerCase().includes(cluster.toLowerCase()))
    );
  }

  return NextResponse.json({
    total: ngos.length,
    timestamp: new Date().toISOString(),
    ngos,
  });
}
