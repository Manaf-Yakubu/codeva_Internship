const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { User } = require('../models');
const AuthUtils = require('../utils/auth');

const authResolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      AuthUtils.requireAuth(user);
      return await User.findByPk(user.id);
    }
  },

  Mutation: {
    register: async (parent, { input }) => {
      const { username, email, password, firstName, lastName } = input;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          $or: [{ email }, { username }]
        }
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new UserInputError('A user with this email already exists');
        }
        if (existingUser.username === username) {
          throw new UserInputError('A user with this username already exists');
        }
      }

      // Validate password strength
      if (password.length < 6) {
        throw new UserInputError('Password must be at least 6 characters long');
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName
      });

      // Generate tokens
      const { accessToken, refreshToken } = AuthUtils.generateTokens(user);

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      return {
        token: accessToken,
        refreshToken,
        user
      };
    },

    login: async (parent, { input }) => {
      const { email, password } = input;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError('Your account has been deactivated');
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Generate tokens
      const { accessToken, refreshToken } = AuthUtils.generateTokens(user);

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      return {
        token: accessToken,
        refreshToken,
        user
      };
    },

    refreshToken: async (parent, { refreshToken }) => {
      try {
        // Verify refresh token
        const decoded = AuthUtils.verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findByPk(decoded.id);
        if (!user || !user.isActive) {
          throw new AuthenticationError('Invalid refresh token');
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = AuthUtils.generateTokens(user);

        return {
          token: accessToken,
          refreshToken: newRefreshToken,
          user
        };
      } catch (error) {
        throw new AuthenticationError('Invalid refresh token');
      }
    },

    logout: async (parent, args, { user }) => {
      AuthUtils.requireAuth(user);
      // In a production app, you might want to blacklist the token
      // For now, we'll just return true
      return true;
    }
  }
};

module.exports = authResolvers;
