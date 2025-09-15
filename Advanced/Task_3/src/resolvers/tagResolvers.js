const { UserInputError } = require('apollo-server-express');
const { Tag, Post, User } = require('../models');
const AuthUtils = require('../utils/auth');
const { Op } = require('sequelize');

const tagResolvers = {
  Query: {
    tags: async () => {
      return await Tag.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']]
      });
    },

    tag: async (parent, { id }, { loaders }) => {
      return await loaders.tagById.load(id);
    },

    tagBySlug: async (parent, { slug }) => {
      return await Tag.findOne({ where: { slug } });
    }
  },

  Mutation: {
    createTag: async (parent, { input }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);

      const { name, description, color } = input;

      // Check if tag name already exists
      const existingTag = await Tag.findOne({
        where: { name: { [Op.iLike]: name } }
      });

      if (existingTag) {
        throw new UserInputError('A tag with this name already exists');
      }

      const tag = await Tag.create({
        name,
        description,
        color
      });

      return tag;
    },

    updateTag: async (parent, { id, input }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);

      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw new UserInputError('Tag not found');
      }

      // Check if name is being changed and if it already exists
      if (input.name && input.name !== tag.name) {
        const existingTag = await Tag.findOne({
          where: { 
            name: { [Op.iLike]: input.name },
            id: { [Op.ne]: id }
          }
        });
        if (existingTag) {
          throw new UserInputError('A tag with this name already exists');
        }
      }

      await tag.update(input);
      return tag;
    },

    deleteTag: async (parent, { id }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN']);

      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw new UserInputError('Tag not found');
      }

      // Remove tag associations with posts
      await tag.setPosts([]);

      await tag.destroy();
      return true;
    }
  },

  Tag: {
    posts: async (parent, args, { loaders }) => {
      return await loaders.postsByTagId.load(parent.id);
    }
  }
};

module.exports = tagResolvers;
