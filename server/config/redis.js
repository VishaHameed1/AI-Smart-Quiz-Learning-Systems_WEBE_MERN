const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.log('⚠️ Redis not configured, skipping...');
    return null;
  }
  
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });
    
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('✅ Redis connected');
    return redisClient;
  } catch (error) {
    console.error('Redis connection failed:', error.message);
    return null;
  }
};

// Cache AI responses
const cacheAIResponse = async (key, data, ttl = 3600) => {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Cache error:', error);
    return false;
  }
};

const getCachedAIResponse = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
};

module.exports = { connectRedis, cacheAIResponse, getCachedAIResponse };