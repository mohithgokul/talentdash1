import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { Level, Currency, Source } from '@prisma/client';

const salarySchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  level: z.nativeEnum(Level, { errorMap: () => ({ message: 'Level must be one of: L3, L4, L5, L6, SDE_I, SDE_II, SDE_III, STAFF, PRINCIPAL, IC4, IC5' }) }),
  location: z.string().min(1, 'Location is required'),
  currency: z.nativeEnum(Currency).default('INR'),
  experience_years: z.number().int().min(1, 'Experience must be > 0').max(50, 'Experience must be < 51'),
  base_salary: z.number().positive('Base salary must be > 0'),
  bonus: z.number().nonnegative().optional().default(0),
  stock: z.number().nonnegative().optional().default(0),
  source: z.nativeEnum(Source).default('CONTRIBUTOR'),
  confidence_score: z.number().min(0.0).max(1.0).default(0.5)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validation pipeline
    const parsed = salarySchema.safeParse(body);
    if (!parsed.success) {
      const error = parsed.error.errors[0];
      return NextResponse.json({
        error: true,
        field: error.path[0],
        message: error.message
      }, { status: 400 });
    }

    const data = parsed.data;

    // 2. Normalisation pipeline
    const normalized_name = data.company.toLowerCase().trim().replace(/[^\w\s]/g, '');
    const slug = normalized_name.replace(/\s+/g, '-');

    let company = await prisma.company.findFirst({
      where: { normalized_name }
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: data.company.trim(),
          slug,
          normalized_name,
          industry: 'Unknown',
          headquarters: 'Unknown',
          headcount_range: 'Unknown',
          founded_year: new Date().getFullYear(),
        }
      });
    }

    // 3. Recompute total_compensation
    const total_compensation = data.base_salary + data.bonus + data.stock;

    // 4. Duplicate check
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const existingRecord = await prisma.salary.findFirst({
      where: {
        company_id: company.id,
        role: data.role,
        level: data.level,
        location: data.location,
        submitted_at: { gte: fortyEightHoursAgo }
      }
    });

    if (existingRecord) {
      // check if base_salary is within 10%
      const baseDiff = Math.abs(Number(existingRecord.base_salary) - data.base_salary);
      const threshold = data.base_salary * 0.10;
      if (baseDiff <= threshold) {
        return NextResponse.json({
          error: true,
          message: 'Conflict: A similar salary record was submitted recently.'
        }, { status: 409 });
      }
    }

    // 5. Store record
    const newSalary = await prisma.salary.create({
      data: {
        company_id: company.id,
        role: data.role,
        level: data.level,
        location: data.location,
        currency: data.currency,
        experience_years: data.experience_years,
        base_salary: data.base_salary,
        bonus: data.bonus,
        stock: data.stock,
        total_compensation: total_compensation,
        source: data.source,
        confidence_score: data.confidence_score,
      }
    });

    // Need to serialize BigInts for JSON
    const serialized = JSON.parse(JSON.stringify(newSalary, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ error: true, message: err.message }, { status: 500 });
  }
}
