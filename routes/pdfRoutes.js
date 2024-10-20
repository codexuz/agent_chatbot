const express = require('express');
const multer = require('multer');
const { parsePDF, queryAI } = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Protected routes for authenticated users
router.post('/upload', authMiddleware, upload.single('file'), parsePDF);
router.post('/query', authMiddleware, queryAI);

module.exports = router;
