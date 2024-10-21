require('dotenv').config();
const { webhookCallback } = require('grammy');

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const botRoutes = require('./routes/botRoutes');
const  bot  = require('./controllers/telegramController');


const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/bot', botRoutes); // Bot routes for saving tokens


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
