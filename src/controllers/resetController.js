import { pool } from "../db.js";

export const resetDatabase = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Clear the table
    await client.query('TRUNCATE TABLE "Contact" RESTART IDENTITY CASCADE');

    // 2. Insert requested state
    await client.query("SET CONSTRAINTS ALL DEFERRED");

    await client.query(`
      INSERT INTO "Contact" ("id", "email", "phoneNumber", "linkPrecedence", "createdAt", "updatedAt")
      OVERRIDING SYSTEM VALUE
      VALUES (1, 'lorraine@hillvalley.edu', '123456', 'primary', '2023-04-01 00:00:00.374+00', '2023-04-01 00:00:00.374+00')
    `);

    await client.query(`
      INSERT INTO "Contact" ("id", "email", "phoneNumber", "linkedId", "linkPrecedence", "createdAt", "updatedAt")
      OVERRIDING SYSTEM VALUE
      VALUES (23, 'mcfly@hillvalley.edu', '123456', 1, 'secondary', '2023-04-20 05:30:00.11+00', '2023-04-20 05:30:00.11+00')
    `);

    await client.query(`
      INSERT INTO "Contact" ("id", "email", "phoneNumber", "linkPrecedence", "createdAt", "updatedAt")
      OVERRIDING SYSTEM VALUE
      VALUES (11, 'george@hillvalley.edu', '919191', 'primary', '2023-04-11 00:00:00.374+00', '2023-04-11 00:00:00.374+00')
    `);

    await client.query(`
      INSERT INTO "Contact" ("id", "email", "phoneNumber", "linkPrecedence", "createdAt", "updatedAt")
      OVERRIDING SYSTEM VALUE
      VALUES (27, 'biffsucks@hillvalley.edu', '717171', 'primary', '2023-04-21 05:30:00.11+00', '2023-04-21 05:30:00.11+00')
    `);

    // Reset sequence to max id to avoid conflicts on next auto-insert
    await client.query(
      `SELECT setval(pg_get_serial_sequence('"Contact"', 'id'), coalesce(max(id), 1)) FROM "Contact"`,
    );

    await client.query("COMMIT");
    console.log("<<< Database reset to requirements state. >>>");
    res.status(200).json({ message: "Table reset successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error resetting table:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
