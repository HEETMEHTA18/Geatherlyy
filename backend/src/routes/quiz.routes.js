const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Get all quizzes' }));
router.post('/', (req, res) => res.json({ message: 'Create quiz' }));
router.get('/:id', (req, res) => res.json({ message: 'Get quiz' }));
router.post('/:id/submit', (req, res) => res.json({ message: 'Submit quiz' }));

module.exports = router;
