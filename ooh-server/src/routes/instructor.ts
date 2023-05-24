import express from 'express';
import { Connection, createConnection, RowDataPacket } from 'mysql2/promise';
import config from '../db_config';
import Queue from './models/Queue';
import { sendEmail } from './emailSender';

const router = express.Router();

/**
 * Merges multiple groups in the queue together into one spot.
 *
 * @param {number[]} groupIds list of groups to merge
 * @throws {400} If the source or target positions are invalid
 * @throws {500} If there is a server error
 */
router.put('/merge', async (req, res) => {
  const { groupIds }: { groupIds: number[] } = req.body;
  groupIds.sort((a, b) => a - b);
  const [targetGroupId, ...otherIds] = groupIds;

  const connection = await createConnection(config);
  for (const id of otherIds) {
    await connection.execute(`
      UPDATE Query
      SET groupid = ${targetGroupId}
      WHERE groupid = ${id}
        AND active = TRUE;
    `);
    await connection.execute(`
      UPDATE \`Group\`
      SET active = FALSE
      WHERE id = ${id}
    `);
  }
  connection.destroy();

  res.send(200);
});

async function selectInOffice(connection: Connection) {
  return connection.execute<RowDataPacket[]>(`
    SELECT *
    FROM \`Group\`
    WHERE inOffice = TRUE
      AND active = TRUE
  `);
}

async function setNextInOffice(connection: Connection) {
  await connection.execute(`
    UPDATE \`Group\` AS G
    JOIN (SELECT MIN(id) AS i FROM \`Group\` WHERE active = TRUE) AS GM ON G.id = GM.i
    SET inOffice = TRUE
    WHERE active = TRUE
  `);
}

async function unsetCurrentActive(connection: Connection) {
  await connection.execute(`
    UPDATE \`Group\` AS G
    JOIN (SELECT MIN(id) AS i FROM \`Group\` WHERE active = TRUE) AS GM ON G.id = GM.i
    SET active = FALSE
    WHERE active = TRUE;
  `);
}

/**
 * Polls the topmost group from the queue.
 *
 * @throws {400} If queue is empty
 * @returns the student object or -1 if queue is empty
 */
router.put('/poll', async (req, res) => {
  const connection = await createConnection(config);
  const [maybeInOffice] = await selectInOffice(connection);
  const isInOffice = maybeInOffice.length;

  if (isInOffice) await unsetCurrentActive(connection);
  await setNextInOffice(connection);

  const [emailRows] = await connection.execute<RowDataPacket[]>(`
    SELECT email
    FROM Query
    INNER JOIN \`Group\` ON Query.groupid = \`Group\`.id
    WHERE \`Group\`.active = TRUE
      AND \`Group\`.inOffice = TRUE
      AND Query.active = TRUE
  `);
  const emails = emailRows.map((v) => v.email);
  for (const email of emails) {
    await sendEmail(email);
  }

  res.sendStatus(200);
});

/**
 * Returns the current state of the queue, which is an array of student
 * objects created with the User interface.  See objectConstructor.ts file
 * for details.
 * Order in the queue is maintained in the returned array.
 *
 * @param res used to send a response back to caller
 * @param req contains any request from caller
 * @returns a An array of records in the Group table
 */
router.get('/queue', async (req, res) => {
  const connection = await createConnection(config);

  const [groupRows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM \`Group\` WHERE active = TRUE`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groups = groupRows.map((r: any) => ({
    id: r.id,
    active: !!r.active,
    topic: r.topic,
    inOffice: !!r.inOffice,
  }));

  const [queryRows] = await connection.execute<RowDataPacket[]>(
    `SELECT * FROM \`Query\` WHERE active = TRUE`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries = queryRows.map((r: any) => ({
    id: r.id,
    groupId: r.groupid,
    active: !!r.active,
    email: r.email,
    content: r.content,
    topic: r.topic,
  }));

  connection.destroy();

  const queue: Queue = groups.map((g) => ({
    ...g,
    queries: queries.filter((q) => q.groupId === g.id),
  }));
  const ret = { queue };

  res.json(ret);
});

export default router;
