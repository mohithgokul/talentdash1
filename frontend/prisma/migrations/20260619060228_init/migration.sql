-- CreateEnum
CREATE TYPE "Level" AS ENUM ('L3', 'L4', 'L5', 'L6', 'SDE_I', 'SDE_II', 'SDE_III', 'STAFF', 'PRINCIPAL', 'IC4', 'IC5');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR', 'USD', 'GBP', 'EUR');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('CONTRIBUTOR', 'SCRAPED', 'AI_INFERRED');

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "headquarters" TEXT NOT NULL,
    "founded_year" INTEGER,
    "headcount_range" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salaries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "location" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "experience_years" INTEGER NOT NULL,
    "base_salary" BIGINT NOT NULL,
    "bonus" BIGINT NOT NULL DEFAULT 0,
    "stock" BIGINT NOT NULL DEFAULT 0,
    "total_compensation" BIGINT NOT NULL,
    "source" "Source" NOT NULL DEFAULT 'CONTRIBUTOR',
    "confidence_score" DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "companies_normalized_name_idx" ON "companies"("normalized_name");

-- CreateIndex
CREATE INDEX "salaries_company_id_level_location_idx" ON "salaries"("company_id", "level", "location");

-- CreateIndex
CREATE INDEX "salaries_total_compensation_idx" ON "salaries"("total_compensation");

-- CreateIndex
CREATE INDEX "salaries_submitted_at_idx" ON "salaries"("submitted_at");

-- CreateIndex
CREATE INDEX "salaries_location_level_idx" ON "salaries"("location", "level");

-- AddForeignKey
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
