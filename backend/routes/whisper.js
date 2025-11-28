const express = require('express');
const router = express.Router();
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit (Whisper's max)
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    const allowedMimes = [
      'audio/webm',
      'audio/wav',
      'audio/mp3',
      'audio/mpeg',
      'audio/ogg',
      'audio/m4a',
    ];
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  },
});

// Test endpoint to verify OpenAI connection
router.get('/test', async (req, res) => {
  try {
    // Just check if API key is set
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not set' });
    }
    res.json({ 
      success: true, 
      message: 'Whisper API is configured',
      hasApiKey: !!process.env.OPENAI_API_KEY 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/whisper/transcribe
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  let renamedPath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('📝 Transcribing audio file:', req.file.filename);
    console.log('File path:', req.file.path);
    console.log('File size:', req.file.size);
    console.log('File mimetype:', req.file.mimetype);

    // Rename file to add .webm extension (OpenAI requires file extension)
    renamedPath = req.file.path + '.webm';
    fs.renameSync(req.file.path, renamedPath);
    
    console.log('Renamed file to:', renamedPath);

    // Use the renamed file with proper extension
    // First, transcribe in Urdu to get Urdu text
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(renamedPath),
      model: 'whisper-1',
      language: 'ur', // Force Urdu language
    });

    console.log('✅ Transcription successful (Urdu):', transcription.text);

    // Detect if the text is in Urdu script (contains Urdu characters)
    const hasUrduScript = /[\u0600-\u06FF]/.test(transcription.text);
    
    let finalText = transcription.text;
    
    // If text is in Urdu script, translate to English for better search results
    if (hasUrduScript) {
      console.log('🔄 Detected Urdu script, translating to English...');
      
      const translation = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a translator. Translate the following Urdu text to English. Keep it concise and suitable for property search. Only return the translation, nothing else.'
          },
          {
            role: 'user',
            content: transcription.text
          }
        ],
        temperature: 0.3,
      });
      
      finalText = translation.choices[0].message.content.trim();
      console.log('✅ Translation to English:', finalText);
    }

    // Clean up the uploaded file
    fs.unlink(renamedPath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.json({
      success: true,
      text: finalText,
      originalText: transcription.text,
      wasTranslated: hasUrduScript,
    });
  } catch (error) {
    console.error('❌ Whisper transcription error:', error);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    if (error.error) {
      console.error('OpenAI error:', error.error);
    }

    // Clean up the file if it exists
    const pathToDelete = renamedPath || req.file?.path;
    if (pathToDelete) {
      fs.unlink(pathToDelete, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to transcribe audio',
      details: error.message,
      openaiError: error.error || null,
    });
  }
});

module.exports = router;
