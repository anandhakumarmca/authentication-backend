const redis = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const redisClient = () => {
  const redisUrl = process.env.redis_url;

  if (!redisUrl) {
    throw new Error("Missing 'redis_url' in environment variables");
  }

  const client = redis.createClient({
    url: redisUrl,
  });

  client.on("error", (err) => {
    console.error(err);
  });

  client.on("connect", () => {
    console.log("Connected to Redis");
  });

  client.on("end", () => {
    console.log("Redis connection ended");
  });

  process.on("SIGQUIT", () => {
    client.quit(() => {
      console.log("Redis client quit gracefully");
    });
  });

  return client;
};

const client = redisClient();

module.exports = client;
