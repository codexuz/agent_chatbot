const axios = require('axios');

const getTelegramBotInfo = async (botToken) => {
 const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getMe`;
 const response = await axios.post(telegramApiUrl);

 if (!response.data.ok) {
      throw new Error(response.data.description);
  }

  return response.data.result
}



module.exports = { getTelegramBotInfo }