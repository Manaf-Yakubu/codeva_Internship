const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');

class AuthUtils {
  static generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  static verifyToken(token, secret = process.env.JWT_SECRET) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  static verifyRefreshToken(token) {
    return this.verifyToken(token, process.env.JWT_REFRESH_SECRET);
  }

  static extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  static requireAuth(user) {
    if (!user) {
      throw new AuthenticationError('You must be logged in to perform this action');
    }
    return user;
  }

  static requireRole(user, allowedRoles) {
    this.requireAuth(user);
    
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }
    
    return user;
  }

  static requireOwnershipOrRole(user, resourceOwnerId, allowedRoles = ['ADMIN', 'MODERATOR']) {
    this.requireAuth(user);
    
    if (user.id === resourceOwnerId || allowedRoles.includes(user.role)) {
      return user;
    }
    
    throw new ForbiddenError('You can only access your own resources');
  }

  static isAdmin(user) {
    return user && user.role === 'ADMIN';
  }

  static isModerator(user) {
    return user && (user.role === 'MODERATOR' || user.role === 'ADMIN');
  }

  static canModerate(user) {
    return this.isModerator(user);
  }
}

module.exports = AuthUtils;
