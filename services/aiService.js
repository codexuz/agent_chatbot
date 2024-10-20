// services/aiService.js
const OpenAI  = require('openai');

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const sendQueryToAI = async (question, pdfText) => {
  try {
    const prompt = `Based on the following PDF content, answer the prompt:\n\nPDF Content:\n${pdfText}\n\Prompt: ${question}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    return response.choices[0].message;
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    throw new Error('Failed to communicate with AI.');
  }
};

module.exports = { sendQueryToAI };
