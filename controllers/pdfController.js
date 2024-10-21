// controllers/pdfController.js
const pdfParse = require('pdf-parse');
const supabase = require('../services/supabaseService');

const { sendQueryToAI } = require('../services/aiService');

// Parse uploaded PDF
const parsePDF = async (req, res) => {
  const { botId } = req.body
  const userId = req.user.id

  try {
    
    const pdfData = await pdfParse(req.file.buffer);
    
    // Save parsed PDF content to Supabase
    const { data, error } = await supabase
      .from('pdfs')
      .insert([
        {
          filename: req.file.filename,
          content: pdfData.text,
          file_path: filePath,
          bot_id: botId,
          user_id: userId
        },
      ]);

    if (error) {
      throw error;
    }
    
    res.status(200).json({ message: 'PDF uploaded, parsed, and saved to database successfully.' });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ message: 'Failed to parse PDF.' });
  }
};

// Handle customer query
const queryAI = async (req, res) => {
    const { question, botId } = req.body;

  if (!question || !botId) {
    return res.status(400).json({ message: 'Please, enter question and botId' });
  }

   try {
    // Fetch the PDF content from Supabase based on the filename
    const { data, error } = await supabase
      .from('pdfs')
      .select('content')
      .eq('bot_id', botId)
      .single();

    if (error || !data) {
      return res.status(400).json({ message: 'No PDF data available. Please upload a PDF first.' });
    }

    const pdfText = data.content;

    // Send query to AI with the PDF text
    const response = await sendQueryToAI(question, pdfText);

    res.status(200).json({ answer: response });
  } catch (error) {
    console.error('Error querying AI or fetching PDF content:', error);
    res.status(500).json({ message: 'Failed to get response from AI.' });
  }

};

module.exports = { parsePDF, queryAI };
