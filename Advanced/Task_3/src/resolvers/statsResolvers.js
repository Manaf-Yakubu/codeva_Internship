const { User, Post, Comment, Category, Tag } = require('../models');
const AuthUtils = require('../utils/auth');

const statsResolvers = {
  Query: {
    stats: async (parent, args, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);

      const [
        totalUsers,
        totalPosts,
        totalComments,
        totalCategories,
        totalTags,
        publishedPosts,
        draftPosts,
        pendingComments
      ] = await Promise.all([
        User.count(),
        Post.count(),
        Comment.count(),
        Category.count(),
        Tag.count(),
        Post.count({ where: { status: 'PUBLISHED' } }),
        Post.count({ where: { status: 'DRAFT' } }),
        Comment.count({ where: { status: 'PENDING' } })
      ]);

      return {
        totalUsers,
        totalPosts,
        totalComments,
        totalCategories,
        totalTags,
        publishedPosts,
        draftPosts,
        pendingComments
      };
    }
  }
};

module.exports = statsResolvers;
