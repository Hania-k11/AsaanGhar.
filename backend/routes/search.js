const express = require('express');
const router = express.Router();
const pool = require('../db');
const { parseSearchQuery } = require('../utils/gptParser');

router.post('/nlp-search', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing search text' });
  }

  try {
    console.log('Received text:', text);

    const filters = await parseSearchQuery(text);

    console.log('GPT Output:', filters);
    return res.json({ filters });
  } catch (err) {
    console.error('NLP Route Error:', err.message);
    return res.status(500).json({ error: 'NLP processing failed', details: err.message });
  }
});



router.get('/', async (req, res) => {
  try {
    // First test the connection
    const connection = await pool.getConnection();
    console.log('Database connection successful');

    // Test if the users table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "users"');
    if (tables.length === 0) {
      connection.release();
      return res.status(404).json({ 
        error: 'Table not found',
        message: 'The users table does not exist in the database'
      });
    }

    // If we get here, try the actual query
    const [rows] = await connection.query('SELECT * FROM users');
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error('Detailed DB Error:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Database error',
      details: err.message,
      code: err.code
    });
  }
});

module.exports = router;
