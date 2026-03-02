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

-- Sample Seed Data (For Testing)
INSERT INTO "Contact" ("id", "email", "phoneNumber", "linkPrecedence", "createdAt", "updatedAt")
VALUES (1, 'lorraine@hillvalley.edu', '123456', 'primary', '2023-04-01 00:00:00.374+00', '2023-04-01 00:00:00.374+00');


INSERT INTO "Contact" ("id", "email", "phoneNumber", "linkedId", "linkPrecedence", "createdAt", "updatedAt")
VALUES (23, 'mcfly@hillvalley.edu', '123456', 1, 'secondary', '2023-04-20 05:30:00.11+00', '2023-04-20 05:30:00.11+00');


INSERT INTO "Contact" ("id", "email", "phoneNumber", "linkPrecedence", "createdAt", "updatedAt")
VALUES (11, 'george@hillvalley.edu', '919191', 'primary', '2023-04-11 00:00:00.374+00', '2023-04-11 00:00:00.374+00');

INSERT INTO "Contact" ("id", "email", "phoneNumber", "linkPrecedence", "createdAt", "updatedAt")
VALUES (27, 'biffsucks@hillvalley.edu', '717171', 'primary', '2023-04-21 05:30:00.11+00', '2023-04-21 05:30:00.11+00');




-- Resetting sequence for ID
SELECT setval(pg_get_serial_sequence('"Contact"', 'id'), coalesce(max(id), 1)) FROM "Contact";
