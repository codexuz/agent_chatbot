const express = require('express');
const supabase = require('../services/supabaseService');
const { setTelegramWebhook, handleTelegramUpdate } = require('../controllers/telegramController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Save bot token and set webhook
router.post('/token', authMiddleware, setTelegramWebhook);
router.post('/:userId', handleTelegramUpdate);


module.exports = router;
