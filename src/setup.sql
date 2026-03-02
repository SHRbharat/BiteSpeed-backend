-- SQL to create the Contact table
CREATE TABLE IF NOT EXISTS "Contact" (
    "id" SERIAL PRIMARY KEY,
    "phoneNumber" VARCHAR,
    "email" VARCHAR,
    "linkedId" INTEGER,
    "linkPrecedence" VARCHAR DEFAULT 'primary' CHECK ("linkPrecedence" IN ('primary', 'secondary')),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Index for faster reconciliation
CREATE INDEX IF NOT EXISTS "idx_contact_email" ON "Contact"("email");
CREATE INDEX IF NOT EXISTS "idx_contact_phoneNumber" ON "Contact"("phoneNumber");
