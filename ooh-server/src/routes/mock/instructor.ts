import express from 'express';

const router = express.Router();

/**
 * Groups multiple queries in the queue together into one spot.
 *
 * @param {number} source The source query position to group from
 * @param {number} target The target query position to group into
 * @throws {400} If the source or target positions are invalid
 * @throws {500} If there is a server error
 */
router.put('/group', (req, res) => {
  res.sendStatus(200);
});

/**
 * Polls the topmost query from the queue.
 *
 * @throws {400} If queue is empty
 * @returns the student object or -1 if queue is empty
 */
router.post('/poll', (req, res) => {
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
 * @returns {Student[]} An array of rows of students
 */
router.get('/queue', (req, res) => {
  res.json({
    queue: [
      {
        groupId: 3,
        active: true,
        topic: 'whatever',
        queries: [{ email: 'dudor@wisc.edu', query: 'idk' }],
      },
      {
        groupId: 4,
        active: true,
        topic: 'ok',
        queries: [{ email: 'csfrank3@wisc.edu', query: 'wow' }],
      },
      {
        groupId: 5,
        active: true,
        topic: 'shut',
        queries: [{ email: 'eltimmerman@wisc.edu', query: 'cool' }],
      },
      {
        groupId: 6,
        active: true,
        topic: 'up',
        queries: [
          { email: 'spintz@wisc.edu', query: 'dang' },
          { email: 'raaja@wisc.edu', query: 'damn' },
        ],
      },
    ],
  });
});

export default router;
