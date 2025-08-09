const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query(
      `SELECT 
         user_id, first_name, last_name, email, job_title, gender, phone_number, 
         profile_picture_url, bio, city, is_verified, created_at, updated_at, 
         status, role 
       FROM users 
       WHERE email = ? AND is_deleted = FALSE`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const [[{ password_hash }]] = await pool.query(
      'SELECT password_hash FROM users WHERE email = ?',
      [email]
    );

    if (!password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    const match = await bcrypt.compare(password, password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


//------------------------------------
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