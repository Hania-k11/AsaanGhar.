const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function hashAndUpdatePassword(email, plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const pool = mysql.createPool({
   host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '12345',
  database:'asaanghardb',
    });

    await pool.query(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hashedPassword, email]
    );

    console.log(`Password for ${email} updated with bcrypt hash.`);
    process.exit(0);
  } catch (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
}

// Replace with the email and plain password you want to hash
hashAndUpdatePassword('hania@gmail.com', '12345');
