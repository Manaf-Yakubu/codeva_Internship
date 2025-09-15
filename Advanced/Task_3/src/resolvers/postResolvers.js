const { UserInputError, ForbiddenError } = require('apollo-server-express');
const { Post, User, Category, Tag, PostTag } = require('../models');
const AuthUtils = require('../utils/auth');
const { Op } = require('sequelize');
const EventEmitter = require('events');

const pubsub = new EventEmitter();

const postResolvers = {
  Query: {
    posts: async (parent, { filters = {}, sort, pagination = {} }, { loaders }) => {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      // Build where clause from filters
      const whereClause = {};
      
      if (filters.status) {
        whereClause.status = filters.status;
      }
      
      if (filters.categoryId) {
        whereClause.categoryId = filters.categoryId;
      }
      
      if (filters.authorId) {
        whereClause.authorId = filters.authorId;
      }
      
      if (filters.search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${filters.search}%` } },
          { content: { [Op.iLike]: `%${filters.search}%` } },
          { excerpt: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      // Build order clause
      let orderClause = [['created_at', 'DESC']];
      if (sort) {
        orderClause = [[sort.field, sort.order]];
      }

      const include = [
        { model: User, as: 'author' },
        { model: Category, as: 'category' },
        { 
          model: Tag, 
          as: 'tags',
          through: { attributes: [] }
        }
      ];

      // Handle tag filtering
      if (filters.tagIds && filters.tagIds.length > 0) {
        include.push({
          model: Tag,
          as: 'tags',
          where: { id: filters.tagIds },
          through: { attributes: [] }
        });
      }

      const { count, rows: posts } = await Post.findAndCountAll({
        where: whereClause,
        include,
        limit,
        offset,
        order: orderClause,
        distinct: true
      });

      const totalPages = Math.ceil(count / limit);

      return {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    },

    post: async (parent, { id }, { loaders }) => {
      return await loaders.postById.load(id);
    },

    postBySlug: async (parent, { slug }) => {
      return await Post.findOne({
        where: { slug },
        include: [
          { model: User, as: 'author' },
          { model: Category, as: 'category' },
          { 
            model: Tag, 
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });
    },

    myPosts: async (parent, { pagination = {} }, { user, loaders }) => {
      AuthUtils.requireAuth(user);

      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const { count, rows: posts } = await Post.findAndCountAll({
        where: { authorId: user.id },
        include: [
          { model: User, as: 'author' },
          { model: Category, as: 'category' },
          { 
            model: Tag, 
            as: 'tags',
            through: { attributes: [] }
          }
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      const totalPages = Math.ceil(count / limit);

      return {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    }
  },

  Mutation: {
    createPost: async (parent, { input }, { user }) => {
      AuthUtils.requireAuth(user);

      const { tagIds, ...postData } = input;
      
      // Check if slug is unique
      if (postData.slug) {
        const existingPost = await Post.findOne({ where: { slug: postData.slug } });
        if (existingPost) {
          throw new UserInputError('A post with this slug already exists');
        }
      }

      // Create post
      const post = await Post.create({
        ...postData,
        authorId: user.id,
        publishedAt: postData.status === 'PUBLISHED' ? new Date() : null
      });

      // Add tags if provided
      if (tagIds && tagIds.length > 0) {
        const tags = await Tag.findAll({ where: { id: tagIds } });
        await post.setTags(tags);
      }

      // Load the complete post with associations
      const completePost = await Post.findByPk(post.id, {
        include: [
          { model: User, as: 'author' },
          { model: Category, as: 'category' },
          { 
            model: Tag, 
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });

      // Publish subscription
      pubsub.emit('POST_ADDED', { postAdded: completePost });

      return completePost;
    },

    updatePost: async (parent, { id, input }, { user }) => {
      const post = await Post.findByPk(id);
      if (!post) {
        throw new UserInputError('Post not found');
      }

      // Check ownership or admin/moderator role
      AuthUtils.requireOwnershipOrRole(user, post.authorId);

      const { tagIds, ...updateData } = input;

      // Check slug uniqueness if being updated
      if (updateData.slug && updateData.slug !== post.slug) {
        const existingPost = await Post.findOne({ 
          where: { 
            slug: updateData.slug,
            id: { [Op.ne]: id }
          } 
        });
        if (existingPost) {
          throw new UserInputError('A post with this slug already exists');
        }
      }

      // Update published date if status changes to PUBLISHED
      if (updateData.status === 'PUBLISHED' && post.status !== 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }

      await post.update(updateData);

      // Update tags if provided
      if (tagIds !== undefined) {
        if (tagIds.length > 0) {
          const tags = await Tag.findAll({ where: { id: tagIds } });
          await post.setTags(tags);
        } else {
          await post.setTags([]);
        }
      }

      // Load the complete updated post
      const updatedPost = await Post.findByPk(id, {
        include: [
          { model: User, as: 'author' },
          { model: Category, as: 'category' },
          { 
            model: Tag, 
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });

      // Publish subscription
      pubsub.emit('POST_UPDATED', { postUpdated: updatedPost });

      return updatedPost;
    },

    deletePost: async (parent, { id }, { user }) => {
      const post = await Post.findByPk(id);
      if (!post) {
        throw new UserInputError('Post not found');
      }

      // Check ownership or admin role
      AuthUtils.requireOwnershipOrRole(user, post.authorId, ['ADMIN']);

      await post.destroy();
      return true;
    },

    publishPost: async (parent, { id }, { user }) => {
      const post = await Post.findByPk(id);
      if (!post) {
        throw new UserInputError('Post not found');
      }

      // Check ownership or moderator role
      AuthUtils.requireOwnershipOrRole(user, post.authorId);

      await post.update({
        status: 'PUBLISHED',
        publishedAt: new Date()
      });

      return await Post.findByPk(id, {
        include: [
          { model: User, as: 'author' },
          { model: Category, as: 'category' },
          { 
            model: Tag, 
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });
    },

    unpublishPost: async (parent, { id }, { user }) => {
      const post = await Post.findByPk(id);
      if (!post) {
        throw new UserInputError('Post not found');
      }

      // Check ownership or moderator role
      AuthUtils.requireOwnershipOrRole(user, post.authorId);

      await post.update({
        status: 'DRAFT',
        publishedAt: null
      });

      return await Post.findByPk(id, {
        include: [
          { model: User, as: 'author' },
          { model: Category, as: 'category' },
          { 
            model: Tag, 
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });
    },

    incrementPostViews: async (parent, { id }) => {
      const post = await Post.findByPk(id);
      if (!post) {
        throw new UserInputError('Post not found');
      }

      await post.increment('viewCount');
      return await Post.findByPk(id, {
        include: [
          { model: User, as: 'author' },
          { model: Category, as: 'category' },
          { 
            model: Tag, 
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });
    }
  },

  Subscription: {
    postAdded: {
      subscribe: () => ({
        [Symbol.asyncIterator]: () => ({
          next: () => new Promise(resolve => {
            pubsub.once('POST_ADDED', data => resolve({ value: data, done: false }));
          })
        })
      })
    },
    postUpdated: {
      subscribe: () => ({
        [Symbol.asyncIterator]: () => ({
          next: () => new Promise(resolve => {
            pubsub.once('POST_UPDATED', data => resolve({ value: data, done: false }));
          })
        })
      })
    }
  },

  Post: {
    author: async (parent, args, { loaders }) => {
      return await loaders.userById.load(parent.authorId);
    },

    category: async (parent, args, { loaders }) => {
      return parent.categoryId ? await loaders.categoryById.load(parent.categoryId) : null;
    },

    tags: async (parent, args, { loaders }) => {
      return await loaders.tagsByPostId.load(parent.id);
    },

    comments: async (parent, args, { loaders }) => {
      return await loaders.commentsByPostId.load(parent.id);
    }
  }
};

module.exports = postResolvers;
