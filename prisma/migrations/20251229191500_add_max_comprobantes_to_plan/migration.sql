-- Add missing columns to Plan table
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "maxComprobantes" INTEGER DEFAULT 100;
