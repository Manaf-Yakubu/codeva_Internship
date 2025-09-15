const { DateTimeResolver } = require('graphql-scalars');
const authResolvers = require('./authResolvers');
const userResolvers = require('./userResolvers');
const postResolvers = require('./postResolvers');
const commentResolvers = require('./commentResolvers');
const categoryResolvers = require('./categoryResolvers');
const tagResolvers = require('./tagResolvers');
const statsResolvers = require('./statsResolvers');

const resolvers = {
  DateTime: DateTimeResolver,

  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...categoryResolvers.Query,
    ...tagResolvers.Query,
    ...statsResolvers.Query
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...tagResolvers.Mutation
  },

  Subscription: {
    ...postResolvers.Subscription,
    ...commentResolvers.Subscription
  },

  // Type resolvers
  User: userResolvers.User,
  Post: postResolvers.Post,
  Comment: commentResolvers.Comment,
  Category: categoryResolvers.Category,
  Tag: tagResolvers.Tag
};

module.exports = resolvers;
