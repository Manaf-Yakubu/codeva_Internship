-- Initialize database with extensions and basic setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Create indexes for better performance (will be created by Sequelize, but good to have as backup)
-- These will be created automatically by the models, but included for reference

-- Performance optimization queries
-- Enable query optimization
SET shared_preload_libraries = 'pg_stat_statements';

-- Create database if it doesn't exist (handled by Docker environment)
-- This file is mainly for any initial setup or extensions needed
