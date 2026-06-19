const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { sendContact } = require('../controllers/contactController');

// POST /api/contact
router.post('/', asyncHandler(sendContact));

module.exports = router;
