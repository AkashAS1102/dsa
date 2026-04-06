import { NextRequest, NextResponse } from 'next/server';
import { getProblemById } from '@/lib/mock-data';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const problem = getProblemById(params.id);
  if (!problem) {
    return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
  }
  return NextResponse.json(problem);
}
