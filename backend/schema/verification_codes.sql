-- Drop existing verification_codes table
DROP TABLE IF EXISTS verification_codes;

-- Create verification_codes table
-- Note: Foreign key constraint removed for compatibility
-- The user_id still references users(user_id) but without enforcement
CREATE TABLE verification_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email_code VARCHAR(6) NOT NULL,
  phone_code VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Add foreign key constraint manually after table creation
-- Only run this if you want the CASCADE delete behavior
-- ALTER TABLE verification_codes 
-- ADD CONSTRAINT fk_verification_user 
-- FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
