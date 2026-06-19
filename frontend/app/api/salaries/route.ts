import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Level, Currency } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination
    let page = parseInt(searchParams.get('page') || '1', 10);
    if (isNaN(page) || page < 1) page = 1;

    let limit = parseInt(searchParams.get('limit') || '25', 10);
    if (isNaN(limit) || limit < 1) limit = 25;
    if (limit > 100) limit = 100;

    // Filters
    const company = searchParams.get('company');
    const role = searchParams.get('role');
    const level = searchParams.get('level') as Level | null;
    const location = searchParams.get('location');
    const currency = searchParams.get('currency') as Currency | null;

    // Sort
    const sort = searchParams.get('sort') || 'total_comp_desc';
    let orderBy: any = {};
    if (sort === 'total_comp_asc') {
      orderBy = { total_compensation: 'asc' };
    } else if (sort === 'date_desc') {
      orderBy = { submitted_at: 'desc' };
    } else {
      orderBy = { total_compensation: 'desc' };
    }

    const where: any = {};

    if (company) {
      where.company = {
        name: { contains: company, mode: 'insensitive' }
      };
    }
    if (role) {
      where.role = { contains: role, mode: 'insensitive' };
    }
    if (level) {
      where.level = level;
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    if (currency) {
      where.currency = currency;
    }

    const [total, records] = await Promise.all([
      prisma.salary.count({ where }),
      prisma.salary.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    // Serialize BigInt for JSON
    const serializedRecords = records.map(r => JSON.parse(JSON.stringify(r, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )));

    return NextResponse.json({
      data: serializedRecords,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=3600'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}
