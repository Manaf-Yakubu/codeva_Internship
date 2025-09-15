const { UserInputError, ForbiddenError } = require('apollo-server-express');
const { User } = require('../models');
const AuthUtils = require('../utils/auth');
const { Op } = require('sequelize');

const userResolvers = {
  Query: {
    users: async (parent, { pagination = {}, search }, { user, loaders }) => {
      AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);

      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const whereClause = search ? {
        [Op.or]: [
          { username: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } }
        ]
      } : {};

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      const totalPages = Math.ceil(count / limit);

      return {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    },

    user: async (parent, { id }, { loaders }) => {
      return await loaders.userById.load(id);
    },

    userByUsername: async (parent, { username }) => {
      return await User.findOne({ where: { username } });
    }
  },

  Mutation: {
    updateProfile: async (parent, { input }, { user }) => {
      AuthUtils.requireAuth(user);

      const currentUser = await User.findByPk(user.id);
      if (!currentUser) {
        throw new UserInputError('User not found');
      }

      // Check if username is being changed and if it's already taken
      if (input.username && input.username !== currentUser.username) {
        const existingUser = await User.findOne({
          where: { username: input.username }
        });
        if (existingUser) {
          throw new UserInputError('Username is already taken');
        }
      }

      await currentUser.update(input);
      return currentUser;
    },

    updateUserRole: async (parent, { userId, role }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN']);

      const targetUser = await User.findByPk(userId);
      if (!targetUser) {
        throw new UserInputError('User not found');
      }

      // Prevent admin from changing their own role
      if (user.id === userId) {
        throw new ForbiddenError('You cannot change your own role');
      }

      await targetUser.update({ role });
      return targetUser;
    },

    deactivateUser: async (parent, { userId }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN']);

      const targetUser = await User.findByPk(userId);
      if (!targetUser) {
        throw new UserInputError('User not found');
      }

      // Prevent admin from deactivating themselves
      if (user.id === userId) {
        throw new ForbiddenError('You cannot deactivate your own account');
      }

      await targetUser.update({ isActive: false });
      return targetUser;
    },

    activateUser: async (parent, { userId }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN']);

      const targetUser = await User.findByPk(userId);
      if (!targetUser) {
        throw new UserInputError('User not found');
      }

      await targetUser.update({ isActive: true });
      return targetUser;
    }
  },

  User: {
    fullName: (parent) => {
      return parent.getFullName();
    },

    posts: async (parent, args, { loaders }) => {
      return await loaders.postsByAuthorId.load(parent.id);
    },

    comments: async (parent, args, { loaders }) => {
      return await loaders.commentsByAuthorId.load(parent.id);
    }
  }
};

module.exports = userResolvers;
