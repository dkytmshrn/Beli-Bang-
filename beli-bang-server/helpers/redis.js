const Redis = require("ioredis");

const redis = new Redis({
  port: 15035, // Redis port
  host: "redis-15035.c295.ap-southeast-1-1.ec2.cloud.redislabs.com", // Redis host
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
