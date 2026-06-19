import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const slug = (await params).slug;

    const company = await prisma.company.findUnique({
      where: { slug }
    });

    if (!company) {
      return NextResponse.json({ error: true, message: 'Company not found' }, { status: 404 });
    }

    const salaries = await prisma.salary.findMany({
      where: { company_id: company.id },
      orderBy: { total_compensation: 'desc' }
    });

    // Compute Level Distribution
    const level_distribution: Record<string, number> = {};
    for (const s of salaries) {
      const lvl = s.level.toString();
      level_distribution[lvl] = (level_distribution[lvl] || 0) + 1;
    }

    // Compute true median total_compensation
    let median_total_compensation: string | number | null = null;
    if (salaries.length > 0) {
      // already sorted descending, but we need ascending for standard median calculation
      // we can just use the sorted array (order doesn't matter for finding the middle, just needs to be sorted)
      const sortedTcs = salaries.map(s => s.total_compensation);
      const mid = Math.floor(sortedTcs.length / 2);
      if (sortedTcs.length % 2 === 0) {
        median_total_compensation = ((sortedTcs[mid - 1] + sortedTcs[mid]) / BigInt(2)).toString();
      } else {
        median_total_compensation = sortedTcs[mid].toString();
      }
    }

    // Serialize BigInts
    const serializedSalaries = salaries.map(r => JSON.parse(JSON.stringify(r, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )));
    const serializedCompany = JSON.parse(JSON.stringify(company));

    return NextResponse.json({
      company: serializedCompany,
      salaries: serializedSalaries,
      median_total_compensation,
      level_distribution
    }, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}
