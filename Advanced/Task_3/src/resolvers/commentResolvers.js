const { UserInputError } = require('apollo-server-express');
const { Comment, User, Post } = require('../models');
const AuthUtils = require('../utils/auth');
const { Op } = require('sequelize');
const EventEmitter = require('events');

const pubsub = new EventEmitter();

const commentResolvers = {
  Query: {
    comments: async (parent, { postId, pagination = {} }, { loaders }) => {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const whereClause = postId ? { postId } : {};

      const { count, rows: comments } = await Comment.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'author' },
          { model: Post, as: 'post' },
          { model: Comment, as: 'parent' }
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      const totalPages = Math.ceil(count / limit);

      return {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    },

    comment: async (parent, { id }, { loaders }) => {
      return await loaders.commentById.load(id);
    }
  },

  Mutation: {
    createComment: async (parent, { input }, { user }) => {
      AuthUtils.requireAuth(user);

      const { postId, parentId, content } = input;

      // Verify post exists
      const post = await Post.findByPk(postId);
      if (!post) {
        throw new UserInputError('Post not found');
      }

      // Verify parent comment exists if provided
      if (parentId) {
        const parentComment = await Comment.findByPk(parentId);
        if (!parentComment) {
          throw new UserInputError('Parent comment not found');
        }
        if (parentComment.postId !== postId) {
          throw new UserInputError('Parent comment must belong to the same post');
        }
      }

      // Create comment
      const comment = await Comment.create({
        content,
        postId,
        parentId,
        authorId: user.id
      });

      // Load complete comment with associations
      const completeComment = await Comment.findByPk(comment.id, {
        include: [
          { model: User, as: 'author' },
          { model: Post, as: 'post' },
          { model: Comment, as: 'parent' }
        ]
      });

      // Publish subscription
      pubsub.emit('COMMENT_ADDED', { 
        commentAdded: completeComment,
        postId: postId
      });

      return completeComment;
    },

    updateComment: async (parent, { id, input }, { user }) => {
      const comment = await Comment.findByPk(id);
      if (!comment) {
        throw new UserInputError('Comment not found');
      }

      // Check ownership or moderator role for content updates
      if (input.content) {
        AuthUtils.requireOwnershipOrRole(user, comment.authorId);
      }

      // Check moderator role for status updates
      if (input.status) {
        AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);
      }

      await comment.update(input);

      // Load updated comment with associations
      const updatedComment = await Comment.findByPk(id, {
        include: [
          { model: User, as: 'author' },
          { model: Post, as: 'post' },
          { model: Comment, as: 'parent' }
        ]
      });

      // Publish subscription
      pubsub.emit('COMMENT_UPDATED', { commentUpdated: updatedComment });

      return updatedComment;
    },

    deleteComment: async (parent, { id }, { user }) => {
      const comment = await Comment.findByPk(id);
      if (!comment) {
        throw new UserInputError('Comment not found');
      }

      // Check ownership or admin role
      AuthUtils.requireOwnershipOrRole(user, comment.authorId, ['ADMIN']);

      await comment.destroy();
      return true;
    },

    approveComment: async (parent, { id }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);

      const comment = await Comment.findByPk(id);
      if (!comment) {
        throw new UserInputError('Comment not found');
      }

      await comment.update({ status: 'APPROVED' });

      return await Comment.findByPk(id, {
        include: [
          { model: User, as: 'author' },
          { model: Post, as: 'post' },
          { model: Comment, as: 'parent' }
        ]
      });
    },

    rejectComment: async (parent, { id }, { user }) => {
      AuthUtils.requireRole(user, ['ADMIN', 'MODERATOR']);

      const comment = await Comment.findByPk(id);
      if (!comment) {
        throw new UserInputError('Comment not found');
      }

      await comment.update({ status: 'REJECTED' });

      return await Comment.findByPk(id, {
        include: [
          { model: User, as: 'author' },
          { model: Post, as: 'post' },
          { model: Comment, as: 'parent' }
        ]
      });
    }
  },

  Subscription: {
    commentAdded: {
      subscribe: () => ({
        [Symbol.asyncIterator]: () => ({
          next: () => new Promise(resolve => {
            pubsub.once('COMMENT_ADDED', data => resolve({ value: data, done: false }));
          })
        })
      })
    },
    commentUpdated: {
      subscribe: () => ({
        [Symbol.asyncIterator]: () => ({
          next: () => new Promise(resolve => {
            pubsub.once('COMMENT_UPDATED', data => resolve({ value: data, done: false }));
          })
        })
      })
    }
  },

  Comment: {
    author: async (parent, args, { loaders }) => {
      return await loaders.userById.load(parent.authorId);
    },

    post: async (parent, args, { loaders }) => {
      return await loaders.postById.load(parent.postId);
    },

    parent: async (parent, args, { loaders }) => {
      return parent.parentId ? await loaders.commentById.load(parent.parentId) : null;
    },

    replies: async (parent, args, { loaders }) => {
      return await loaders.commentReplies.load(parent.id);
    }
  }
};

module.exports = commentResolvers;
