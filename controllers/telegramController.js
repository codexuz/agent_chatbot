const axios = require('axios');
const { Bot } = require('grammy');
const supabase = require('../services/supabaseService');
const { getTelegramBotInfo } = require('../services/telegramService');

// Function to set the webhook for a specific bot
const setTelegramWebhook = async (req, res) => {
  const { botToken } = req.body;
  const userId = req.user.id; // Assuming user is authenticated
  
  if (!botToken) {
    return res.status(400).json({ error: 'Bot token is required' });
  }

  try {
    const tg_data = await getTelegramBotInfo(botToken);
   console.log(tg_data)
    // Store bot token in Supabase
    const { data, error } = await supabase
      .from('user_bots')
      .upsert({ user_id: userId, bot_token: botToken, tg_data });

    if (error) {
      throw new Error('Failed to save bot token.');
    }

    // Set the webhook URL for the user's bot
    const webhookUrl = `${process.env.SERVER_URL}/bot/${userId}`;
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;

    const response = await axios.post(telegramApiUrl, { url: webhookUrl });
    if (!response.data.ok) {
      throw new Error(response.data.description);
    }

    res.status(200).json({ message: 'Bot token saved and webhook set.' });
   
  } catch (error) {
    // Only log the error message to avoid circular structure issues
    console.error('Error setting webhook:', error.message);
    res.status(401).json({ error: error.message });
  }
};


// Dynamic bot handler based on the bot token stored in the database
const handleTelegramUpdate = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Fetch the bot token from Supabase for this user
    const { data, error } = await supabase
      .from('user_bots')
      .select('bot_token')
      .eq('user_id', userId)
      .single();

       console.log(data)

    if (error || !data) {
      res.status(404).json({message: 'Bot token not found for this user.'});
    }


    const bot = new Bot(data.bot_token);
    bot.handleUpdate(req.body);
    res.sendStatus(200);
    
  } catch (error) {
    // Only log the error message, not the full error object
    console.error('Error handling Telegram update:', error.message);
    res.sendStatus(500);
  }
};


module.exports = {
  setTelegramWebhook,
  handleTelegramUpdate,
};
