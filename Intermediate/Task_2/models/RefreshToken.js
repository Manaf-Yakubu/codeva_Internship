const pool = require('../config/database');
const crypto = require('crypto');

class RefreshToken {
  constructor(id, token_hash, user_id, expires_at, created_at, is_revoked) {
    this.id = id;
    this.token_hash = token_hash;
    this.user_id = user_id;
    this.expires_at = expires_at;
    this.created_at = created_at;
    this.is_revoked = is_revoked;
  }

  // Create a new refresh token
  static async create(userId, token) {
    try {
      // Hash the token for security
      const token_hash = crypto.createHash('sha256').update(token).digest('hex');
      
      // Set expiry based on environment variable
      const expiryDays = 7; // 7 days default
      const expires_at = new Date();
      expires_at.setDate(expires_at.getDate() + expiryDays);

      const query = `
        INSERT INTO refresh_tokens (token_hash, user_id, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      const values = [token_hash, userId, expires_at];
      const result = await pool.query(query, values);
      
      return new RefreshToken(
        result.rows[0].id,
        result.rows[0].token_hash,
        result.rows[0].user_id,
        result.rows[0].expires_at,
        result.rows[0].created_at,
        result.rows[0].is_revoked
      );
    } catch (error) {
      throw error;
    }
  }

  // Find refresh token by token value
  static async findByToken(token) {
    try {
      const token_hash = crypto.createHash('sha256').update(token).digest('hex');
      
      const query = `
        SELECT * FROM refresh_tokens 
        WHERE token_hash = $1 AND is_revoked = FALSE AND expires_at > NOW()
      `;
      
      const result = await pool.query(query, [token_hash]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new RefreshToken(
        result.rows[0].id,
        result.rows[0].token_hash,
        result.rows[0].user_id,
        result.rows[0].expires_at,
        result.rows[0].created_at,
        result.rows[0].is_revoked
      );
    } catch (error) {
      throw error;
    }
  }

  // Revoke a refresh token
  static async revoke(token) {
    try {
      const token_hash = crypto.createHash('sha256').update(token).digest('hex');
      
      const query = 'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token_hash = $1';
      await pool.query(query, [token_hash]);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Revoke all tokens for a user
  static async revokeAllForUser(userId) {
    try {
      const query = 'UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = $1';
      await pool.query(query, [userId]);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Clean up expired tokens
  static async cleanupExpired() {
    try {
      const query = 'DELETE FROM refresh_tokens WHERE expires_at < NOW() OR is_revoked = TRUE';
      const result = await pool.query(query);
      
      return result.rowCount;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RefreshToken;
