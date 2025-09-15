const { Sequelize } = require('sequelize');
const redis = require('redis');

// PostgreSQL connection
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? false : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    paranoid: false,
  },
});

// Redis connection
let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Redis connection failed:', error);
    // Continue without Redis if connection fails
    return null;
  }
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    
    // Sync database in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
    }
    
    return sequelize;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

const getRedisClient = () => redisClient;

module.exports = {
  sequelize,
  connectDB,
  connectRedis,
  getRedisClient
};
