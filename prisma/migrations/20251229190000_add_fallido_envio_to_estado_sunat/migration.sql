-- Add FALLIDO_ENVIO to EstadoSunat enum if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'FALLIDO_ENVIO' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EstadoSunat')) THEN
        ALTER TYPE "EstadoSunat" ADD VALUE 'FALLIDO_ENVIO';
    END IF;
END $$;
