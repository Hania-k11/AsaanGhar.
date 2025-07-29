const express = require('express');
const router = express.Router();
const pool = require('../db');

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



router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", email, password);

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    console.log("Query result:", rows);

    if (rows.length === 0 || rows[0].password !== password) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    delete user.password;

    return res.json({ user });
  } catch (err) {
    console.error("Login route error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
