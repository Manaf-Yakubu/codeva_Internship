const DataLoader = require('dataloader');
const { User, Post, Comment, Category, Tag } = require('../models');

class DataLoaderFactory {
  static createLoaders() {
    return {
      // User loaders
      userById: new DataLoader(async (ids) => {
        const users = await User.findAll({
          where: { id: ids },
          order: [['created_at', 'DESC']]
        });
        return ids.map(id => users.find(user => user.id === id) || null);
      }),

      usersByIds: new DataLoader(async (userIds) => {
        const users = await User.findAll({
          where: { id: userIds }
        });
        return userIds.map(id => users.filter(user => user.id === id));
      }),

      // Post loaders
      postById: new DataLoader(async (ids) => {
        const posts = await Post.findAll({
          where: { id: ids },
          include: [
            { model: User, as: 'author' },
            { model: Category, as: 'category' }
          ]
        });
        return ids.map(id => posts.find(post => post.id === id) || null);
      }),

      postsByAuthorId: new DataLoader(async (authorIds) => {
        const posts = await Post.findAll({
          where: { authorId: authorIds },
          include: [
            { model: User, as: 'author' },
            { model: Category, as: 'category' }
          ],
          order: [['created_at', 'DESC']]
        });
        return authorIds.map(authorId => 
          posts.filter(post => post.authorId === authorId)
        );
      }),

      postsByCategoryId: new DataLoader(async (categoryIds) => {
        const posts = await Post.findAll({
          where: { categoryId: categoryIds },
          include: [
            { model: User, as: 'author' },
            { model: Category, as: 'category' }
          ],
          order: [['created_at', 'DESC']]
        });
        return categoryIds.map(categoryId => 
          posts.filter(post => post.categoryId === categoryId)
        );
      }),

      // Comment loaders
      commentById: new DataLoader(async (ids) => {
        const comments = await Comment.findAll({
          where: { id: ids },
          include: [
            { model: User, as: 'author' },
            { model: Post, as: 'post' }
          ]
        });
        return ids.map(id => comments.find(comment => comment.id === id) || null);
      }),

      commentsByPostId: new DataLoader(async (postIds) => {
        const comments = await Comment.findAll({
          where: { postId: postIds },
          include: [
            { model: User, as: 'author' },
            { model: Comment, as: 'parent' }
          ],
          order: [['created_at', 'ASC']]
        });
        return postIds.map(postId => 
          comments.filter(comment => comment.postId === postId)
        );
      }),

      commentsByAuthorId: new DataLoader(async (authorIds) => {
        const comments = await Comment.findAll({
          where: { authorId: authorIds },
          include: [
            { model: User, as: 'author' },
            { model: Post, as: 'post' }
          ],
          order: [['created_at', 'DESC']]
        });
        return authorIds.map(authorId => 
          comments.filter(comment => comment.authorId === authorId)
        );
      }),

      commentReplies: new DataLoader(async (parentIds) => {
        const replies = await Comment.findAll({
          where: { parentId: parentIds },
          include: [
            { model: User, as: 'author' }
          ],
          order: [['created_at', 'ASC']]
        });
        return parentIds.map(parentId => 
          replies.filter(reply => reply.parentId === parentId)
        );
      }),

      // Category loaders
      categoryById: new DataLoader(async (ids) => {
        const categories = await Category.findAll({
          where: { id: ids }
        });
        return ids.map(id => categories.find(category => category.id === id) || null);
      }),

      // Tag loaders
      tagById: new DataLoader(async (ids) => {
        const tags = await Tag.findAll({
          where: { id: ids }
        });
        return ids.map(id => tags.find(tag => tag.id === id) || null);
      }),

      tagsByPostId: new DataLoader(async (postIds) => {
        const postTags = await Post.findAll({
          where: { id: postIds },
          include: [{
            model: Tag,
            as: 'tags',
            through: { attributes: [] }
          }]
        });
        return postIds.map(postId => {
          const post = postTags.find(p => p.id === postId);
          return post ? post.tags : [];
        });
      }),

      postsByTagId: new DataLoader(async (tagIds) => {
        const tagPosts = await Tag.findAll({
          where: { id: tagIds },
          include: [{
            model: Post,
            as: 'posts',
            through: { attributes: [] },
            include: [
              { model: User, as: 'author' },
              { model: Category, as: 'category' }
            ]
          }]
        });
        return tagIds.map(tagId => {
          const tag = tagPosts.find(t => t.id === tagId);
          return tag ? tag.posts : [];
        });
      })
    };
  }

  static clearAll(loaders) {
    Object.values(loaders).forEach(loader => {
      if (loader && typeof loader.clearAll === 'function') {
        loader.clearAll();
      }
    });
  }

  static prime(loaders, key, value) {
    Object.values(loaders).forEach(loader => {
      if (loader && typeof loader.prime === 'function') {
        loader.prime(key, value);
      }
    });
  }
}

module.exports = DataLoaderFactory;
