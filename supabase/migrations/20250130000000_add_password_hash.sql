-- Add password_hash column to users table
-- This migration adds password authentication support to the users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;

-- Add index for performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_users_password_hash ON users(password_hash);

-- Update RLS policies to handle password_hash column
-- Note: password_hash should never be exposed in SELECT queries for security
-- This is just to ensure the column exists for authentication purposes