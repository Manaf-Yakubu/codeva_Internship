# GraphQL API Examples

This file contains example queries, mutations, and subscriptions for the CodeVa GraphQL API.

## Authentication Examples

### Register a New User
```graphql
mutation Register {
  register(input: {
    username: "newuser"
    email: "newuser@example.com"
    password: "SecurePass123!"
    firstName: "New"
    lastName: "User"
  }) {
    token
    refreshToken
    user {
      id
      username
      email
      role
      fullName
    }
  }
}
```

### Login
```graphql
mutation Login {
  login(input: {
    email: "admin@codeva.com"
    password: "Admin123!"
  }) {
    token
    refreshToken
    user {
      id
      username
      email
      role
      fullName
      lastLoginAt
    }
  }
}
```

### Get Current User
```graphql
query Me {
  me {
    id
    username
    email
    firstName
    lastName
    fullName
    role
    isActive
    bio
    profilePicture
    posts {
      id
      title
      status
    }
    comments {
      id
      content
      status
    }
  }
}
```

### Refresh Token
```graphql
mutation RefreshToken {
  refreshToken(refreshToken: "your_refresh_token_here") {
    token
    refreshToken
    user {
      id
      username
      role
    }
  }
}
```

## Post Management Examples

### Create a New Post
```graphql
mutation CreatePost {
  createPost(input: {
    title: "Getting Started with GraphQL"
    content: "GraphQL is a powerful query language for APIs that provides a complete and understandable description of the data in your API..."
    excerpt: "Learn the basics of GraphQL and how it compares to REST APIs"
    status: PUBLISHED
    categoryId: "category-uuid-here"
    tagIds: ["tag1-uuid", "tag2-uuid"]
  }) {
    id
    title
    content
    excerpt
    slug
    status
    publishedAt
    viewCount
    author {
      username
      fullName
    }
    category {
      name
      slug
    }
    tags {
      name
      slug
    }
  }
}
```

### Get Posts with Filters and Pagination
```graphql
query Posts {
  posts(
    filters: {
      status: PUBLISHED
      search: "GraphQL"
    }
    sort: {
      field: "publishedAt"
      order: DESC
    }
    pagination: {
      page: 1
      limit: 10
    }
  ) {
    posts {
      id
      title
      excerpt
      slug
      status
      publishedAt
      viewCount
      featuredImage
      author {
        username
        fullName
      }
      category {
        name
        slug
        color
      }
      tags {
        name
        slug
        color
      }
    }
    pagination {
      currentPage
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Get Single Post by Slug
```graphql
query PostBySlug {
  postBySlug(slug: "getting-started-with-graphql") {
    id
    title
    content
    excerpt
    slug
    status
    publishedAt
    viewCount
    featuredImage
    author {
      username
      fullName
      bio
      profilePicture
    }
    category {
      name
      slug
      description
      color
    }
    tags {
      name
      slug
      description
      color
    }
    comments {
      id
      content
      status
      createdAt
      author {
        username
        fullName
      }
      replies {
        id
        content
        author {
          username
        }
      }
    }
  }
}
```

### Update a Post
```graphql
mutation UpdatePost {
  updatePost(
    id: "post-uuid-here"
    input: {
      title: "Advanced GraphQL Techniques"
      content: "Updated content here..."
      status: PUBLISHED
      tagIds: ["new-tag-uuid"]
    }
  ) {
    id
    title
    content
    status
    updatedAt
    tags {
      name
    }
  }
}
```

### Publish/Unpublish Post
```graphql
mutation PublishPost {
  publishPost(id: "post-uuid-here") {
    id
    title
    status
    publishedAt
  }
}

mutation UnpublishPost {
  unpublishPost(id: "post-uuid-here") {
    id
    title
    status
    publishedAt
  }
}
```

## Comment Management Examples

### Create a Comment
```graphql
mutation CreateComment {
  createComment(input: {
    content: "Great article! This really helped me understand GraphQL better."
    postId: "post-uuid-here"
  }) {
    id
    content
    status
    createdAt
    author {
      username
      fullName
    }
    post {
      title
    }
  }
}
```

### Create a Reply to Comment
```graphql
mutation CreateReply {
  createComment(input: {
    content: "Thanks for the feedback! Glad it was helpful."
    postId: "post-uuid-here"
    parentId: "parent-comment-uuid"
  }) {
    id
    content
    status
    createdAt
    author {
      username
    }
    parent {
      id
      author {
        username
      }
    }
  }
}
```

### Get Comments for a Post
```graphql
query Comments {
  comments(
    postId: "post-uuid-here"
    pagination: { page: 1, limit: 20 }
  ) {
    comments {
      id
      content
      status
      createdAt
      author {
        username
        fullName
        profilePicture
      }
      replies {
        id
        content
        createdAt
        author {
          username
          fullName
        }
      }
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}
```

### Moderate Comments (Admin/Moderator)
```graphql
mutation ApproveComment {
  approveComment(id: "comment-uuid-here") {
    id
    content
    status
    author {
      username
    }
  }
}

mutation RejectComment {
  rejectComment(id: "comment-uuid-here") {
    id
    content
    status
  }
}
```

## Category and Tag Management

### Get All Categories
```graphql
query Categories {
  categories {
    id
    name
    slug
    description
    color
    isActive
    posts {
      id
      title
      status
    }
  }
}
```

### Create Category (Admin/Moderator)
```graphql
mutation CreateCategory {
  createCategory(input: {
    name: "Machine Learning"
    description: "Articles about AI and machine learning"
    color: "#FF6B6B"
  }) {
    id
    name
    slug
    description
    color
    isActive
  }
}
```

### Get All Tags
```graphql
query Tags {
  tags {
    id
    name
    slug
    description
    color
    isActive
    posts {
      id
      title
    }
  }
}
```

### Create Tag (Admin/Moderator)
```graphql
mutation CreateTag {
  createTag(input: {
    name: "TypeScript"
    description: "JavaScript with static typing"
    color: "#3178C6"
  }) {
    id
    name
    slug
    description
    color
  }
}
```

## User Management Examples

### Get All Users (Admin/Moderator)
```graphql
query Users {
  users(
    search: "john"
    pagination: { page: 1, limit: 10 }
  ) {
    users {
      id
      username
      email
      firstName
      lastName
      fullName
      role
      isActive
      lastLoginAt
      posts {
        id
        title
      }
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}
```

### Update User Profile
```graphql
mutation UpdateProfile {
  updateProfile(input: {
    firstName: "Updated"
    lastName: "Name"
    bio: "Updated bio information"
    profilePicture: "https://example.com/avatar.jpg"
  }) {
    id
    firstName
    lastName
    fullName
    bio
    profilePicture
  }
}
```

### Update User Role (Admin)
```graphql
mutation UpdateUserRole {
  updateUserRole(
    userId: "user-uuid-here"
    role: MODERATOR
  ) {
    id
    username
    role
  }
}
```

## Statistics (Admin/Moderator)

### Get System Statistics
```graphql
query Stats {
  stats {
    totalUsers
    totalPosts
    totalComments
    totalCategories
    totalTags
    publishedPosts
    draftPosts
    pendingComments
  }
}
```

## Subscriptions Examples

### Subscribe to New Posts
```graphql
subscription PostAdded {
  postAdded {
    id
    title
    excerpt
    status
    publishedAt
    author {
      username
      fullName
    }
    category {
      name
    }
  }
}
```

### Subscribe to Comments on a Post
```graphql
subscription CommentAdded($postId: ID!) {
  commentAdded(postId: $postId) {
    id
    content
    status
    createdAt
    author {
      username
      fullName
      profilePicture
    }
  }
}
```

### Subscribe to Comment Updates
```graphql
subscription CommentUpdated {
  commentUpdated {
    id
    content
    status
    updatedAt
    author {
      username
    }
  }
}
```

## Complex Query Examples

### Get User with All Related Data
```graphql
query UserProfile($username: String!) {
  userByUsername(username: $username) {
    id
    username
    email
    firstName
    lastName
    fullName
    role
    bio
    profilePicture
    isActive
    lastLoginAt
    posts(pagination: { limit: 5 }) {
      posts {
        id
        title
        excerpt
        status
        publishedAt
        viewCount
        category {
          name
        }
        tags {
          name
        }
      }
    }
    comments {
      id
      content
      status
      createdAt
      post {
        title
        slug
      }
    }
  }
}
```

### Search Posts with Multiple Filters
```graphql
query SearchPosts {
  posts(
    filters: {
      status: PUBLISHED
      categoryId: "tech-category-uuid"
      tagIds: ["graphql-tag-uuid", "nodejs-tag-uuid"]
      search: "tutorial"
      authorId: "author-uuid"
    }
    sort: {
      field: "viewCount"
      order: DESC
    }
    pagination: {
      page: 1
      limit: 5
    }
  ) {
    posts {
      id
      title
      excerpt
      viewCount
      publishedAt
      author {
        username
      }
      category {
        name
        color
      }
      tags {
        name
        color
      }
    }
    pagination {
      currentPage
      totalPages
      totalItems
      hasNextPage
    }
  }
}
```

## Error Handling Examples

### Invalid Authentication
```graphql
# This will return an authentication error
query Me {
  me {
    id
    username
  }
}
# Headers: {} (no Authorization header)
```

### Insufficient Permissions
```graphql
# This will return a forbidden error for non-admin users
mutation UpdateUserRole {
  updateUserRole(userId: "some-uuid", role: ADMIN) {
    id
    role
  }
}
```

### Validation Errors
```graphql
# This will return validation errors
mutation Register {
  register(input: {
    username: ""
    email: "invalid-email"
    password: "123"
    firstName: ""
    lastName: ""
  }) {
    token
  }
}
```

## Headers for Authentication

When making authenticated requests, include the JWT token in the Authorization header:

```json
{
  "Authorization": "Bearer your_jwt_token_here"
}
```

## Variables Examples

For queries with variables, use this format:

```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000",
  "pagination": {
    "page": 1,
    "limit": 10
  },
  "filters": {
    "status": "PUBLISHED",
    "search": "GraphQL"
  }
}
```
