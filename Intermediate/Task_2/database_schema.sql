-- CodeVa Auth Database Schema
-- PostgreSQL Database Schema for Authentication System
-- Run this script to create the database structure

-- Create database (run this separately as a superuser)
-- CREATE DATABASE codeva_auth;
-- CREATE USER codeva_user WITH PASSWORD 'codeva_password';
-- GRANT ALL PRIVILEGES ON DATABASE codeva_auth TO codeva_user;

-- Connect to codeva_auth database before running the rest

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    token_hash VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_is_revoked ON refresh_tokens(is_revoked);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' with bcrypt rounds=12
INSERT INTO users (name, email, password_hash, role) 
VALUES (
    'Admin User', 
    'admin@codeva.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJgusgqHu', 
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Create a view for user statistics (optional)
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_signups,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as today_signups
FROM users;

-- Create a view for token statistics (optional)
CREATE OR REPLACE VIEW token_stats AS
SELECT 
    COUNT(*) as total_tokens,
    COUNT(CASE WHEN is_revoked = FALSE AND expires_at > NOW() THEN 1 END) as active_tokens,
    COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired_tokens,
    COUNT(CASE WHEN is_revoked = TRUE THEN 1 END) as revoked_tokens
FROM refresh_tokens;

-- Grant permissions to the application user
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO codeva_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON refresh_tokens TO codeva_user;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO codeva_user;
GRANT USAGE, SELECT ON SEQUENCE refresh_tokens_id_seq TO codeva_user;
GRANT SELECT ON user_stats TO codeva_user;
GRANT SELECT ON token_stats TO codeva_user;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '✅ Default admin user created: admin@codeva.com / admin123';
    RAISE NOTICE '✅ All tables, indexes, and permissions configured';
END $$;
