const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Get all activities' }));
router.post('/', (req, res) => res.json({ message: 'Create activity' }));
router.get('/:id', (req, res) => res.json({ message: 'Get activity' }));
router.put('/:id', (req, res) => res.json({ message: 'Update activity' }));
router.delete('/:id', (req, res) => res.json({ message: 'Delete activity' }));

module.exports = router;
