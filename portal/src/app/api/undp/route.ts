import { NextResponse } from 'next/server';
import undpData from '@/data/undp_somalia_projects_documents.json';

export async function GET() {
  return NextResponse.json({
    operating_unit: 'SOM',
    total_active_projects: undpData.length,
    total_downloadable_documents: undpData.reduce((acc, p) => acc + p.documents.length, 0),
    data: undpData
  });
}
