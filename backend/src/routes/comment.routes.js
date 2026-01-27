const express = require('express');
const router = express.Router();

router.get('/:clubId', (req, res) => res.json({ message: 'Get club comments' }));
router.post('/:clubId', (req, res) => res.json({ message: 'Post comment' }));

module.exports = router;
