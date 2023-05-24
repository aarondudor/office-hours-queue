import express from 'express';

const router = express.Router();

/**
 * Queries a student's problem into the queue.
 *
 * @param {String} email the email of the Student
 * @param {String} topic the topic summarizing the problem for the Student
 * @param {String} query the problem for the Student
 * @returns {number} The number for the student in the queue. Think of it as a ticket number.
 * @throws {400} If the name or email are missing or invalid
 */
router.post('/enqueue', (req, res) => {
  res.json({ position: 1 });
});

/**
 * Returns the position of this student's problem in the queue.
 *
 * @param {string} email The email of the student
 * @returns {number} The position of this student's problem in the queue if any otherwise -1
 * @throws {400} If the name or email are missing or invalid
 * @throws {500} If there is a server error
 */
router.post('/position', (req, res) => {
  res.json({ position: -1 });
});

/**
 * Cancels this student's position in the queue.
 *
 * @param {string} email The email of the student
 * @throws {400} If the name or email are missing or invalid
 * @throws {500} If there is a server error
 */
router.post('/dequeue', (req, res) => {
  res.sendStatus(200);
});

export default router;
