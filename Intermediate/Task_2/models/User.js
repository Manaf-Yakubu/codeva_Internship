const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(id, name, email, password_hash, role, created_at) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.created_at = created_at;
  }

  // Create a new user
  static async create({ name, email, password, role = 'user' }) {
    try {
      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (name, email, password_hash, role, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id, name, email, role, created_at
      `;
      
      const values = [name, email, password_hash, role];
      const result = await pool.query(query, values);
      
      return new User(
        result.rows[0].id,
        result.rows[0].name,
        result.rows[0].email,
        null, // Don't return password hash
        result.rows[0].role,
        result.rows[0].created_at
      );
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new User(
        result.rows[0].id,
        result.rows[0].name,
        result.rows[0].email,
        result.rows[0].password_hash,
        result.rows[0].role,
        result.rows[0].created_at
      );
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new User(
        result.rows[0].id,
        result.rows[0].name,
        result.rows[0].email,
        null, // Don't return password hash
        result.rows[0].role,
        result.rows[0].created_at
      );
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }

  // Get user without password hash
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      created_at: this.created_at
    };
  }

  // Get all users (admin only)
  static async findAll() {
    try {
      const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
      const result = await pool.query(query);
      
      return result.rows.map(row => new User(
        row.id,
        row.name,
        row.email,
        null,
        row.role,
        row.created_at
      ));
    } catch (error) {
      throw error;
    }
  }

  // Update user role (admin only)
  static async updateRole(id, role) {
    try {
      const query = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, created_at';
      const result = await pool.query(query, [role, id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new User(
        result.rows[0].id,
        result.rows[0].name,
        result.rows[0].email,
        null,
        result.rows[0].role,
        result.rows[0].created_at
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
