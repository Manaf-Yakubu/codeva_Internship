const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar DateTime
  scalar Upload

  # Enums
  enum UserRole {
    USER
    ADMIN
    MODERATOR
  }

  enum PostStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  enum CommentStatus {
    PENDING
    APPROVED
    REJECTED
  }

  enum SortOrder {
    ASC
    DESC
  }

  # Input Types
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
    firstName: String
    lastName: String
    bio: String
    profilePicture: String
  }

  input CreatePostInput {
    title: String!
    content: String!
    excerpt: String
    slug: String
    status: PostStatus = DRAFT
    featuredImage: String
    categoryId: ID
    tagIds: [ID!]
  }

  input UpdatePostInput {
    title: String
    content: String
    excerpt: String
    slug: String
    status: PostStatus
    featuredImage: String
    categoryId: ID
    tagIds: [ID!]
  }

  input CreateCommentInput {
    content: String!
    postId: ID!
    parentId: ID
  }

  input UpdateCommentInput {
    content: String
    status: CommentStatus
  }

  input CreateCategoryInput {
    name: String!
    description: String
    color: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
    color: String
    isActive: Boolean
  }

  input CreateTagInput {
    name: String!
    description: String
    color: String
  }

  input UpdateTagInput {
    name: String
    description: String
    color: String
    isActive: Boolean
  }

  input PostFilters {
    status: PostStatus
    categoryId: ID
    tagIds: [ID!]
    authorId: ID
    search: String
  }

  input PostSort {
    field: String!
    order: SortOrder!
  }

  input PaginationInput {
    page: Int = 1
    limit: Int = 10
  }

  # Types
  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!
    role: UserRole!
    isActive: Boolean!
    lastLoginAt: DateTime
    profilePicture: String
    bio: String
    posts: [Post!]!
    comments: [Comment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    excerpt: String
    slug: String!
    status: PostStatus!
    featuredImage: String
    publishedAt: DateTime
    viewCount: Int!
    author: User!
    category: Category
    tags: [Tag!]!
    comments: [Comment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    content: String!
    status: CommentStatus!
    author: User!
    post: Post!
    parent: Comment
    replies: [Comment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    color: String
    isActive: Boolean!
    posts: [Post!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
    description: String
    color: String
    isActive: Boolean!
    posts: [Post!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
  }

  type PaginationInfo {
    currentPage: Int!
    totalPages: Int!
    totalItems: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type PostConnection {
    posts: [Post!]!
    pagination: PaginationInfo!
  }

  type UserConnection {
    users: [User!]!
    pagination: PaginationInfo!
  }

  type CommentConnection {
    comments: [Comment!]!
    pagination: PaginationInfo!
  }

  # Queries
  type Query {
    # Authentication
    me: User

    # Users
    users(pagination: PaginationInput, search: String): UserConnection!
    user(id: ID!): User
    userByUsername(username: String!): User

    # Posts
    posts(
      filters: PostFilters
      sort: PostSort
      pagination: PaginationInput
    ): PostConnection!
    post(id: ID!): Post
    postBySlug(slug: String!): Post
    myPosts(pagination: PaginationInput): PostConnection!

    # Comments
    comments(
      postId: ID
      pagination: PaginationInput
    ): CommentConnection!
    comment(id: ID!): Comment

    # Categories
    categories: [Category!]!
    category(id: ID!): Category
    categoryBySlug(slug: String!): Category

    # Tags
    tags: [Tag!]!
    tag(id: ID!): Tag
    tagBySlug(slug: String!): Tag

    # Statistics
    stats: Stats
  }

  # Mutations
  type Mutation {
    # Authentication
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    logout: Boolean!

    # User Management
    updateProfile(input: UpdateUserInput!): User!
    updateUserRole(userId: ID!, role: UserRole!): User!
    deactivateUser(userId: ID!): User!
    activateUser(userId: ID!): User!

    # Posts
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post!
    unpublishPost(id: ID!): Post!
    incrementPostViews(id: ID!): Post!

    # Comments
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, input: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Boolean!
    approveComment(id: ID!): Comment!
    rejectComment(id: ID!): Comment!

    # Categories
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    # Tags
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, input: UpdateTagInput!): Tag!
    deleteTag(id: ID!): Boolean!
  }

  # Subscriptions
  type Subscription {
    postAdded: Post!
    postUpdated: Post!
    commentAdded(postId: ID!): Comment!
    commentUpdated: Comment!
  }

  type Stats {
    totalUsers: Int!
    totalPosts: Int!
    totalComments: Int!
    totalCategories: Int!
    totalTags: Int!
    publishedPosts: Int!
    draftPosts: Int!
    pendingComments: Int!
  }
`;

module.exports = typeDefs;
