import { NextResponse } from 'next/server';
import { getAllDistricts } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const minArrivals = searchParams.get('minArrivals');

  let districts = getAllDistricts();

  if (region) {
    districts = districts.filter(
      (d) => d.region.toLowerCase() === region.toLowerCase()
    );
  }

  if (minArrivals) {
    const min = parseInt(minArrivals, 10);
    districts = districts.filter(
      (d) => (d.ett_2026?.arrivals || 0) >= min
    );
  }

  return NextResponse.json({
    total: districts.length,
    timestamp: new Date().toISOString(),
    districts,
  });
}
