require('dotenv').config();
const { sequelize } = require('./src/models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created');
    
    // Seed data
    console.log('🌱 Seeding database with demo data...');
    
    const { User, Category, Tag, Post, Comment } = require('./src/models');
    
    // Create users
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);
    const userPassword = await bcrypt.hash('User123!', salt);
    
    const adminUser = await User.create({
      id: uuidv4(),
      username: 'admin',
      email: 'admin@codeva.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
      bio: 'System administrator for CodeVa GraphQL API'
    });
    
    const manafUser = await User.create({
      id: uuidv4(),
      username: 'yakubu_manaf',
      email: 'manaf@codeva.com',
      password: userPassword,
      firstName: 'Yakubu',
      lastName: 'Abdul Manaf',
      role: 'MODERATOR',
      isActive: true,
      bio: 'CodeVa Internship participant from Ghana, passionate about GraphQL and modern web development'
    });
    
    const johnUser = await User.create({
      id: uuidv4(),
      username: 'john_doe',
      email: 'john@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      isActive: true,
      bio: 'Regular user exploring the GraphQL API'
    });
    
    console.log('✅ Users created');
    
    // Create categories
    const techCategory = await Category.create({
      id: uuidv4(),
      name: 'Technology',
      slug: 'technology',
      description: 'Latest trends and insights in technology and software development',
      color: '#3B82F6',
      isActive: true
    });
    
    const graphqlCategory = await Category.create({
      id: uuidv4(),
      name: 'GraphQL',
      slug: 'graphql',
      description: 'Everything about GraphQL, Apollo Server, and modern API development',
      color: '#E91E63',
      isActive: true
    });
    
    const webdevCategory = await Category.create({
      id: uuidv4(),
      name: 'Web Development',
      slug: 'web-development',
      description: 'Frontend and backend web development tutorials and best practices',
      color: '#10B981',
      isActive: true
    });
    
    console.log('✅ Categories created');
    
    // Create tags
    const graphqlTag = await Tag.create({
      id: uuidv4(),
      name: 'GraphQL',
      slug: 'graphql',
      description: 'GraphQL query language and runtime',
      color: '#E10098',
      isActive: true
    });
    
    const apolloTag = await Tag.create({
      id: uuidv4(),
      name: 'Apollo Server',
      slug: 'apollo-server',
      description: 'Apollo Server GraphQL implementation',
      color: '#311C87',
      isActive: true
    });
    
    const nodejsTag = await Tag.create({
      id: uuidv4(),
      name: 'Node.js',
      slug: 'nodejs',
      description: 'JavaScript runtime for server-side development',
      color: '#339933',
      isActive: true
    });
    
    console.log('✅ Tags created');
    
    // Create sample posts
    const post1 = await Post.create({
      id: uuidv4(),
      title: 'Getting Started with GraphQL API Development',
      content: 'GraphQL is a powerful query language for APIs that provides a complete and understandable description of the data in your API. In this comprehensive guide, we will explore how to build a production-ready GraphQL API using Apollo Server and Node.js...',
      excerpt: 'Learn how to build a production-ready GraphQL API with Apollo Server',
      slug: 'getting-started-with-graphql-api-development',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      viewCount: 42,
      authorId: manafUser.id,
      categoryId: graphqlCategory.id
    });
    
    const post2 = await Post.create({
      id: uuidv4(),
      title: 'CodeVa Internship: Advanced GraphQL Techniques',
      content: 'During my CodeVa internship in Ghana, I have learned advanced GraphQL techniques including DataLoader for query optimization, authentication with JWT tokens, and real-time subscriptions...',
      excerpt: 'Advanced GraphQL techniques learned during CodeVa internship',
      slug: 'codeva-internship-advanced-graphql-techniques',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      viewCount: 28,
      authorId: manafUser.id,
      categoryId: techCategory.id
    });
    
    // Associate tags with posts
    await post1.setTags([graphqlTag, apolloTag, nodejsTag]);
    await post2.setTags([graphqlTag, nodejsTag]);
    
    console.log('✅ Posts created');
    
    // Create sample comments
    await Comment.create({
      id: uuidv4(),
      content: 'Great article! This really helped me understand GraphQL better. Thanks for sharing your experience from the CodeVa internship.',
      status: 'APPROVED',
      authorId: johnUser.id,
      postId: post1.id
    });
    
    await Comment.create({
      id: uuidv4(),
      content: 'Excellent work on the GraphQL API! The authentication system looks very robust.',
      status: 'APPROVED',
      authorId: adminUser.id,
      postId: post2.id
    });
    
    console.log('✅ Comments created');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('👑 ADMIN: admin@codeva.com / Admin123!');
    console.log('🛡️  MODERATOR: manaf@codeva.com / User123!');
    console.log('👤 USER: john@example.com / User123!');
    console.log('\n🚀 GraphQL Server is ready at http://localhost:4000/graphql');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

setupDatabase();
