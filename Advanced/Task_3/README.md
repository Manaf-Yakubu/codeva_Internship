# CodeVa GraphQL API - Advanced Task 3

A comprehensive GraphQL API built with Apollo Server, Express.js, and PostgreSQL for the CodeVa Internship Program.

## 🚀 Features

### Core GraphQL Features
- **Apollo Server 4** with Express integration
- **Comprehensive Schema** with queries, mutations, and subscriptions
- **Type-safe resolvers** with proper error handling
- **Real-time subscriptions** for posts and comments
- **GraphQL Playground** for API exploration (development mode)

### Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (USER, ADMIN, MODERATOR)
- **Secure password hashing** with bcrypt
- **Token validation middleware** for protected operations

### Database Integration
- **PostgreSQL** with Sequelize ORM
- **Database migrations** for schema management
- **Comprehensive models** with associations and validations
- **Database indexing** for optimal performance
- **Seed data** for development and testing

### Performance Optimization
- **DataLoader** for efficient database queries
- **Query batching** to prevent N+1 problems
- **Database connection pooling**
- **Proper indexing strategy**

### Security Features
- **Rate limiting** on GraphQL endpoints
- **CORS protection** with configurable origins
- **Helmet.js** for security headers
- **Input validation** and sanitization
- **SQL injection prevention**

### Developer Experience
- **Comprehensive error handling** with proper GraphQL errors
- **Development hot reload** with nodemon
- **Environment configuration** with dotenv
- **Health check endpoint** for monitoring
- **Graceful shutdown** handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone and navigate to the project:**
   ```bash
   cd c:\Users\AMN21\codeva_Internship\Advanced\Task_3
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=codeva_graphql_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE codeva_graphql_db;
   ```

5. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

## 🚀 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The GraphQL server will be available at:
- **GraphQL Endpoint:** http://localhost:4000/graphql
- **GraphQL Playground:** http://localhost:4000/graphql (development only)
- **Health Check:** http://localhost:4000/health

## 📊 GraphQL Schema

### Types

#### User
```graphql
type User {
  id: ID!
  username: String!
  email: String!
  firstName: String!
  lastName: String!
  fullName: String!
  role: UserRole!
  isActive: Boolean!
  posts: [Post!]!
  comments: [Comment!]!
}
```

#### Post
```graphql
type Post {
  id: ID!
  title: String!
  content: String!
  slug: String!
  status: PostStatus!
  author: User!
  category: Category
  tags: [Tag!]!
  comments: [Comment!]!
  viewCount: Int!
}
```

#### Comment
```graphql
type Comment {
  id: ID!
  content: String!
  status: CommentStatus!
  author: User!
  post: Post!
  parent: Comment
  replies: [Comment!]!
}
```

### Key Queries

#### Authentication
```graphql
# Get current user
query Me {
  me {
    id
    username
    email
    role
  }
}
```

#### Posts
```graphql
# Get paginated posts with filters
query Posts($filters: PostFilters, $pagination: PaginationInput) {
  posts(filters: $filters, pagination: $pagination) {
    posts {
      id
      title
      excerpt
      author {
        username
      }
      category {
        name
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

### Key Mutations

#### Authentication
```graphql
# Register new user
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    refreshToken
    user {
      id
      username
      email
    }
  }
}

# Login user
mutation Login($input: LoginInput!) {
  login(input: $input) {
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

#### Content Management
```graphql
# Create new post
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    slug
    status
    author {
      username
    }
  }
}
```

### Subscriptions
```graphql
# Subscribe to new posts
subscription PostAdded {
  postAdded {
    id
    title
    author {
      username
    }
  }
}

# Subscribe to new comments on a post
subscription CommentAdded($postId: ID!) {
  commentAdded(postId: $postId) {
    id
    content
    author {
      username
    }
  }
}
```

## 🔐 Authentication

### Demo Accounts
The seeded database includes these demo accounts:

| Role | Email | Password | Username |
|------|-------|----------|----------|
| ADMIN | admin@codeva.com | Admin123! | admin |
| MODERATOR | manaf@codeva.com | User123! | yakubu_manaf |
| USER | john@example.com | User123! | john_doe |
| USER | jane@example.com | User123! | jane_smith |

### Using Authentication
1. **Login to get tokens:**
   ```graphql
   mutation {
     login(input: { email: "admin@codeva.com", password: "Admin123!" }) {
       token
       refreshToken
       user { id username role }
     }
   }
   ```

2. **Include token in headers:**
   ```json
   {
     "Authorization": "Bearer YOUR_JWT_TOKEN"
   }
   ```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Manual Testing with GraphQL Playground
1. Start the development server: `npm run dev`
2. Open http://localhost:4000/graphql in your browser
3. Use the demo accounts to test authentication
4. Explore the schema documentation in the playground

## 📁 Project Structure

```
src/
├── config/
│   └── database.js          # Database configuration
├── migrations/              # Database migrations
├── models/                  # Sequelize models
│   ├── index.js
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Category.js
│   ├── Tag.js
│   └── PostTag.js
├── resolvers/               # GraphQL resolvers
│   ├── index.js
│   ├── authResolvers.js
│   ├── userResolvers.js
│   ├── postResolvers.js
│   ├── commentResolvers.js
│   ├── categoryResolvers.js
│   ├── tagResolvers.js
│   └── statsResolvers.js
├── schema/
│   └── typeDefs.js          # GraphQL schema definitions
├── seeders/                 # Database seeders
├── utils/
│   ├── auth.js              # Authentication utilities
│   └── dataLoader.js        # DataLoader for optimization
└── server.js                # Main server file
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment (development/production)
- `DB_*`: Database connection settings
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `CORS_ORIGIN`: Allowed CORS origin

### Database Scripts
- `npm run db:migrate`: Run migrations
- `npm run db:seed`: Run seeders
- `npm run db:reset`: Reset database (drop, create, migrate, seed)

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Configure database connection pooling
6. Set up monitoring and logging
7. Configure rate limiting appropriately

### Docker Support (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 📈 Performance Considerations

### DataLoader Implementation
- Batches database queries to prevent N+1 problems
- Caches results within a single request
- Automatically handles query deduplication

### Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling for concurrent requests
- Efficient association loading with Sequelize

### Security Best Practices
- JWT token expiration and refresh mechanism
- Rate limiting to prevent abuse
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is part of the CodeVa Internship Program and is for educational purposes.

## 👨‍💻 Author

**Yakubu Abdul Manaf**
- Email: manafyakubu@gmail.com
- GitHub: [Your GitHub Profile]
- CodeVa Internship Participant from Ghana

## 🙏 Acknowledgments

- CodeVa Internship Program
- Apollo GraphQL Team
- Sequelize ORM Team
- PostgreSQL Community

---

**Built with ❤️ in Ghana for the CodeVa Internship Program**
