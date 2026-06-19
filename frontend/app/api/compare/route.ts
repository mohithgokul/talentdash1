import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const s1 = searchParams.get('s1');
    const s2 = searchParams.get('s2');

    if (!s1 || !s2) {
      return NextResponse.json({ error: true, message: 'Missing s1 or s2 parameters' }, { status: 400 });
    }

    if (s1 === s2) {
      return NextResponse.json({ error: true, message: 'Cannot compare a record to itself' }, { status: 400 });
    }

    const [record1, record2] = await Promise.all([
      prisma.salary.findUnique({ where: { id: s1 }, include: { company: true } }),
      prisma.salary.findUnique({ where: { id: s2 }, include: { company: true } })
    ]);

    if (!record1 || !record2) {
      return NextResponse.json({ error: true, message: 'One or both salary records not found' }, { status: 404 });
    }

    const delta = {
      base_delta: (record1.base_salary - record2.base_salary).toString(),
      bonus_delta: (record1.bonus - record2.bonus).toString(),
      stock_delta: (record1.stock - record2.stock).toString(),
      tc_delta: (record1.total_compensation - record2.total_compensation).toString(),
      experience_delta: record1.experience_years - record2.experience_years
    };

    // Serialize BigInts
    const serialize = (obj: any) => JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({
      record1: serialize(record1),
      record2: serialize(record2),
      delta
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}
