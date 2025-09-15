const { UserInputError } = require('apollo-server-express');
const { Category, Post, User } = require('../models');
const AuthUtils = require('../utils/auth');
const { Op } = require('sequelize');

const categoryResolvers = {
  Query: {
    categories: async () => {
      return await Category.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']]
      });
    },

    category: async (parent, { id }, { loaders }) => {
      return await loaders.categoryById.load(id);
    },

    categoryBySlug: async (parent, { slug }) => {
      return await Category.findOne({ where: { slug } });
    }
  },

  Mutation: {
    createCategory: async (parent, { input }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);

      const { name, description, color } = input;

      // Check if category name already exists
      const existingCategory = await Category.findOne({
        where: { name: { [Op.iLike]: name } }
      });

      if (existingCategory) {
        throw new UserInputError('A category with this name already exists');
      }

      const category = await Category.create({
        name,
        description,
        color
      });

      return category;
    },

    updateCategory: async (parent, { id, input }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);

      const category = await Category.findByPk(id);
      if (!category) {
        throw new UserInputError('Category not found');
      }

      // Check if name is being changed and if it already exists
      if (input.name && input.name !== category.name) {
        const existingCategory = await Category.findOne({
          where: { 
            name: { [Op.iLike]: input.name },
            id: { [Op.ne]: id }
          }
        });
        if (existingCategory) {
          throw new UserInputError('A category with this name already exists');
        }
      }

      await category.update(input);
      return category;
    },

    deleteCategory: async (parent, { id }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN']);

      const category = await Category.findByPk(id);
      if (!category) {
        throw new UserInputError('Category not found');
      }

      // Check if category has posts
      const postCount = await Post.count({ where: { categoryId: id } });
      if (postCount > 0) {
        throw new UserInputError('Cannot delete category that has posts. Please reassign or delete the posts first.');
      }

      await category.destroy();
      return true;
    }
  },

  Category: {
    posts: async (parent, args, { loaders }) => {
      return await loaders.postsByCategoryId.load(parent.id);
    }
  }
};

module.exports = categoryResolvers;
