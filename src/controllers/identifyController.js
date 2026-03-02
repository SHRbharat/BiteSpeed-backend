import { pool } from "../db.js";

export const identify = async (req, res) => {
  const { email, phoneNumber } = req.body;

  // Input Normalization
  const normalizedEmail = email ? email.toLowerCase().trim() : null;
  const normalizedPhone = phoneNumber ? phoneNumber.toString().trim() : null;

  console.log(
    `<<<< Starting for Email: ${normalizedEmail}, Phone: ${normalizedPhone} >>>>`,
  );

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Find all matching contacts
    const query =
      'SELECT * FROM "Contact" WHERE "email" = $1 OR "phoneNumber" = $2 FOR UPDATE';
    const params = [normalizedEmail, normalizedPhone];
    const { rows: initialMatches } = await client.query(query, params);

    console.log(`Initial matches found: ${initialMatches.length}`);

    // No existing contacts, create new primary
    if (initialMatches.length === 0) {
      const insertQuery =
        'INSERT INTO "Contact" ("email", "phoneNumber", "linkPrecedence") VALUES ($1, $2, $3) RETURNING *';
      const {
        rows: [newContact],
      } = await client.query(insertQuery, [
        normalizedEmail,
        normalizedPhone,
        "primary",
      ]);

      console.log(
        `No matches. Created new primary contact ID: ${newContact.id}`,
      );

      await client.query("COMMIT");

      return res.status(200).json({
        contact: {
          primaryContatctId: newContact.id,
          emails: [newContact.email].filter(Boolean),
          phoneNumbers: [newContact.phoneNumber].filter(Boolean),
          secondaryContactIds: [],
        },
      });
    }

    // 2. Identify all primary contact IDs involved
    const primaryIdsSet = new Set();
    for (const contact of initialMatches) {
      primaryIdsSet.add(
        contact.linkPrecedence === "primary" ? contact.id : contact.linkedId,
      );
    }

    console.log(
      `Involved Primary IDs: ${Array.from(primaryIdsSet).join(", ")}`,
    );

    // Fetch and lock involved primary contacts
    const primaryIds = Array.from(primaryIdsSet);
    const { rows: primaryContacts } = await client.query(
      'SELECT * FROM "Contact" WHERE "id" = ANY($1) ORDER BY "createdAt" ASC FOR UPDATE',
      [primaryIds],
    );

    const primaryContact = primaryContacts[0];
    const primaryId = primaryContact.id;

    console.log(`Selected oldest Primary ID: ${primaryId}`);

    // 3. Handle merging if multiple primary contacts are involved
    if (primaryContacts.length > 1) {
      const secondaryPrimaryIds = primaryContacts.slice(1).map((c) => c.id);

      // Convert newer primaries to secondary and link them to the oldest primary
      await client.query(
        'UPDATE "Contact" SET "linkPrecedence" = $1, "linkedId" = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ANY($3) OR "linkedId" = ANY($3)',
        ["secondary", primaryId, secondaryPrimaryIds],
      );
      console.log(
        `Merged ${secondaryPrimaryIds.length} newer primaries into Primary ID: ${primaryId}`,
      );
    }

    // 4. Check if we need to create a new secondary contact
    const emailExists = initialMatches.some((c) => c.email === normalizedEmail);
    const phoneExists = initialMatches.some(
      (c) => c.phoneNumber === normalizedPhone,
    );

    if (
      (normalizedEmail && !emailExists) ||
      (normalizedPhone && !phoneExists)
    ) {
      await client.query(
        'INSERT INTO "Contact" ("email", "phoneNumber", "linkedId", "linkPrecedence") VALUES ($1, $2, $3, $4)',
        [normalizedEmail, normalizedPhone, primaryId, "secondary"],
      );
      console.log(`Created new secondary contact for new information.`);
    }

    // 5. Final Consolidation within the same transaction
    const { rows: allLinkedContacts } = await client.query(
      'SELECT * FROM "Contact" WHERE "id" = $1 OR "linkedId" = $1 ORDER BY "createdAt" ASC',
      [primaryId],
    );

    console.log(
      `Total linked contacts for consolidation: ${allLinkedContacts.length}`,
    );

    await client.query("COMMIT");

    const emails = [];
    const phoneNumbers = [];
    const secondaryContactIds = [];

    // Ensure the primary info is represented
    if (primaryContact.email) emails.push(primaryContact.email);
    if (primaryContact.phoneNumber)
      phoneNumbers.push(primaryContact.phoneNumber);

    for (const contact of allLinkedContacts) {
      if (contact.id === primaryId) continue;

      secondaryContactIds.push(contact.id);
      if (contact.email && !emails.includes(contact.email)) {
        emails.push(contact.email);
      }
      if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber)) {
        phoneNumbers.push(contact.phoneNumber);
      }
    }

    return res.status(200).json({
      contact: {
        primaryContatctId: primaryId,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in /identify:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
