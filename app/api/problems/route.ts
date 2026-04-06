import { NextRequest, NextResponse } from 'next/server';
import { PROBLEMS, getFilteredProblems } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const difficulty = searchParams.get('difficulty') as any;
  const tag = searchParams.get('tag') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '20');

  const filtered = getFilteredProblems({ difficulty: difficulty || 'All', tag, search });
  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Strip verbose fields from list view
  const problems = paginated.map(({ starterCode, testCases, visualizerTimeline, ...p }) => p);

  return NextResponse.json({ problems, total, page, limit });
}
