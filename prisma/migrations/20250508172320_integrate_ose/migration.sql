-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "providerActive" BOOLEAN DEFAULT false,
ADD COLUMN     "providerClientId" TEXT,
ADD COLUMN     "providerClientSecret" TEXT,
ADD COLUMN     "providerEnv" JSONB,
ADD COLUMN     "providerToken" TEXT,
ADD COLUMN     "solPass" TEXT,
ADD COLUMN     "solUser" TEXT,
ADD COLUMN     "tokenCreatedAt" TIMESTAMP(3),
ADD COLUMN     "tokenUpdatedAt" TIMESTAMP(3);
