# Database Setup Guide

This guide covers installation and basic configuration for MongoDB, MySQL, and PostgreSQL on Windows.

## 🍃 MongoDB Setup

### Installation

#### Method 1: MongoDB Community Server (Recommended)
1. **Download MongoDB**
   - Visit [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows x64
   - Download the MSI installer

2. **Install MongoDB**
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - ✅ Install MongoDB as a Service
   - ✅ Install MongoDB Compass (GUI tool)

3. **Verify Installation**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # Connect to MongoDB
   mongosh
   ```

#### Method 2: Using Chocolatey
```powershell
choco install mongodb
```

### Configuration

1. **Default Configuration File Location:**
   ```
   C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg
   ```

2. **Basic Configuration:**
   ```yaml
   # mongod.cfg
   storage:
     dbPath: C:\data\db
   systemLog:
     destination: file
     path: C:\data\log\mongod.log
   net:
     port: 27017
     bindIp: 127.0.0.1
   ```

3. **Create Data Directories:**
   ```powershell
   mkdir C:\data\db
   mkdir C:\data\log
   ```

### Basic Commands
```javascript
// Connect to MongoDB
mongosh

// Show databases
show dbs

// Create/switch to database
use myapp

// Create collection and insert document
db.users.insertOne({name: "John", email: "john@example.com"})

// Find documents
db.users.find()

// Exit
exit
```

## 🐬 MySQL Setup

### Installation

#### Method 1: MySQL Installer (Recommended)
1. **Download MySQL**
   - Visit [dev.mysql.com/downloads/installer](https://dev.mysql.com/downloads/installer/)
   - Download MySQL Installer for Windows

2. **Install MySQL**
   - Run the installer
   - Choose "Developer Default" setup type
   - Follow the configuration wizard
   - Set root password (remember this!)
   - Configure MySQL as Windows Service

3. **Verify Installation**
   ```powershell
   # Check MySQL service
   Get-Service -Name MySQL80
   
   # Connect to MySQL
   mysql -u root -p
   ```

#### Method 2: Using Chocolatey
```powershell
choco install mysql
```

### Configuration

1. **Configuration File Location:**
   ```
   C:\ProgramData\MySQL\MySQL Server 8.0\my.ini
   ```

2. **Basic Configuration:**
   ```ini
   [mysqld]
   port=3306
   basedir="C:/Program Files/MySQL/MySQL Server 8.0/"
   datadir="C:/ProgramData/MySQL/MySQL Server 8.0/Data/"
   default-storage-engine=INNODB
   sql-mode="STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO"
   ```

### Basic Commands
```sql
-- Connect to MySQL
mysql -u root -p

-- Show databases
SHOW DATABASES;

-- Create database
CREATE DATABASE myapp;

-- Use database
USE myapp;

-- Create table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- Insert data
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');

-- Select data
SELECT * FROM users;

-- Exit
EXIT;
```

## 🐘 PostgreSQL Setup

### Installation

#### Method 1: Official Installer (Recommended)
1. **Download PostgreSQL**
   - Visit [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
   - Download the latest version installer

2. **Install PostgreSQL**
   - Run the installer
   - Set password for postgres user (remember this!)
   - Choose port 5432 (default)
   - Select default locale
   - ✅ Install Stack Builder (optional tools)

3. **Verify Installation**
   ```powershell
   # Check PostgreSQL service
   Get-Service -Name postgresql*
   
   # Connect to PostgreSQL
   psql -U postgres
   ```

#### Method 2: Using Chocolatey
```powershell
choco install postgresql
```

### Configuration

1. **Configuration Files Location:**
   ```
   C:\Program Files\PostgreSQL\15\data\postgresql.conf
   C:\Program Files\PostgreSQL\15\data\pg_hba.conf
   ```

2. **Basic Configuration (postgresql.conf):**
   ```ini
   # Connection settings
   listen_addresses = 'localhost'
   port = 5432
   max_connections = 100
   
   # Memory settings
   shared_buffers = 128MB
   
   # Logging
   log_destination = 'stderr'
   logging_collector = on
   log_directory = 'log'
   ```

### Basic Commands
```sql
-- Connect to PostgreSQL
psql -U postgres

-- List databases
\l

-- Create database
CREATE DATABASE myapp;

-- Connect to database
\c myapp

-- Create table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- Insert data
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');

-- Select data
SELECT * FROM users;

-- List tables
\dt

-- Exit
\q
```

## 🔧 Database Tools and GUIs

### MongoDB
- **MongoDB Compass** (included with installation)
- **Studio 3T** (third-party, free tier available)
- **Robo 3T** (free, lightweight)

### MySQL
- **MySQL Workbench** (official, free)
- **phpMyAdmin** (web-based)
- **HeidiSQL** (free, Windows)

### PostgreSQL
- **pgAdmin** (official web-based GUI)
- **DBeaver** (free, multi-database)
- **DataGrip** (JetBrains, paid)

## 🔗 Connection Strings

### MongoDB
```javascript
// Local connection
mongodb://localhost:27017/myapp

// With authentication
mongodb://username:password@localhost:27017/myapp
```

### MySQL
```
// Local connection
mysql://root:password@localhost:3306/myapp

// JDBC format
jdbc:mysql://localhost:3306/myapp?useSSL=false&serverTimezone=UTC
```

### PostgreSQL
```
// Local connection
postgresql://postgres:password@localhost:5432/myapp

// Alternative format
postgres://postgres:password@localhost:5432/myapp
```

## 🧪 Testing Database Connections

### Node.js Connection Examples

#### MongoDB (using Mongoose)
```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
```

#### MySQL (using mysql2)
```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'myapp'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL connected');
});
```

#### PostgreSQL (using pg)
```javascript
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'your_password',
});

client.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('PostgreSQL connection error:', err));
```

## 🔍 Troubleshooting

### Common Issues:

1. **Service won't start**
   ```powershell
   # Check Windows services
   services.msc
   
   # Restart service via PowerShell
   Restart-Service -Name "MongoDB" # or MySQL80, postgresql-x64-15
   ```

2. **Connection refused**
   - Check if service is running
   - Verify port numbers
   - Check firewall settings
   - Ensure correct credentials

3. **Permission denied**
   - Run command prompt as Administrator
   - Check user permissions in database
   - Verify authentication method

4. **Port already in use**
   ```powershell
   # Check what's using the port
   netstat -ano | findstr :27017  # MongoDB
   netstat -ano | findstr :3306   # MySQL
   netstat -ano | findstr :5432   # PostgreSQL
   ```

## 📚 Next Steps

1. ✅ Choose one database to start with (MongoDB recommended for beginners)
2. 🔧 Install a GUI tool for easier management
3. 📖 Learn basic CRUD operations
4. 🏗️ Practice creating schemas/collections
5. 🔐 Learn about user management and security
6. 📊 Explore indexing and performance optimization

## 🔗 Useful Resources

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Design Basics](https://www.lucidchart.com/pages/database-diagram/database-design)
