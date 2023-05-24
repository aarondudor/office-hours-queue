import express from 'express';
import { createConnection, RowDataPacket } from 'mysql2/promise';
import config from '../db_config';

const router = express.Router();

/**
 * Queries a student's problem into the queue.
 *
 * @param {String} email the email of the Student
 * @param {String} topic the topic for the Student
 * @param {String} content the problem for the Student
 * @throws {400} If the name or email are missing or invalid
 */
router.post('/enqueue/', async (req, res) => {
  const { email, topic, content } = req.body;
  const connection = await createConnection(config);

  await connection.execute(`
    INSERT INTO \`Group\`(active, topic, inOffice)
    VALUES (DEFAULT, '${topic}', DEFAULT);
  `);

  // create a new Query for the student
  await connection.execute(`
    INSERT INTO Query(email, content, groupid, active, topic) 
    VALUES ('${email}', '${content}', (SELECT id FROM \`Group\` ORDER BY id DESC LIMIT 1), DEFAULT, '${topic}');
  `);

  res.sendStatus(200);
});

/**
 * Returns the position of this student's problem in the queue.
 *
 * @param {string} email The email of the student
 * @returns {number} The position of this student's problem in the queue if any otherwise -1
 * @throws {400} If the name or email are missing or invalid
 * @throws {500} If there is a server error
 */
router.post('/position/', async (req, res) => {
  const { email } = req.body;
  const connection = await createConnection(config);
  const [idRows] = await connection.execute<RowDataPacket[]>(`
    SELECT groupid
    FROM Query
    INNER JOIN \`Group\` ON Query.groupid = \`Group\`.id
    WHERE email = '${email}'
      AND \`Group\`.active = TRUE
      AND Query.active = TRUE
    LIMIT 1
  `);

  if (!idRows.length) {
    res.json({ position: -1 });
  } else {
    const id = idRows[0].groupid;
    const [countRows] = await connection.execute(`
    SELECT COUNT(*) AS position
    FROM \`Group\`
    WHERE active = TRUE
        AND id < ${id}
  `);

    const { position } = countRows[0];
    res.json({ position });
  }
});

/**
 * Cancels this student's position in the queue.
 *
 * @param {string} email The email of the student
 * @throws {400} If the name or email are missing or invalid
 * @throws {500} If there is a server error
 */
router.post('/dequeue', async (req, res) => {
  const { email } = req.body;
  const connection = await createConnection(config);
  await connection.execute(`
    UPDATE Query
    INNER JOIN \`Group\`
            ON Query.groupid = \`Group\`.id
    SET Query.active = FALSE
    WHERE email = '${email}'
      AND \`Group\`.active = TRUE
      AND Query.active = TRUE;
  `);

  res.sendStatus(200);
});

export default router;
