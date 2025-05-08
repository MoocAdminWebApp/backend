const { createClient } = require("redis");
const { cacheConfig } = require("../../appConfig");
let client;
const redisClient = async () => {
  if (client) return;

  client = await createClient({
    url: `redis://${cacheConfig.host}:${cacheConfig.port}`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
};

/**
 * Add cache
 * @param {*} key
 * @param {*} value
 * @param {*} ttl  second
 */
const setAsync = async (key, value, ttl = null) => {
  if (!client) await redisClient();

  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  await client.set(key, value);
  //
  if (ttl != null) {
    await client.expire(key, ttl);
  }
};

/**
 * Retrieve cache based on key
 * @param {*} key
 * @returns
 */
const getAsync = async (key) => {
  if (!client) await redisClient();
  const value = await client.get(key);
  return value;
};

/**
 * Delete cache based on key
 * @param {*} key
 */
const delAsync = async (key) => {
  if (!client) await redisClient();
  await client.del(key);
};

/**
 * check key is exists
 * @param {*} key
 */
const hasAsync = async (key) => {
  if (!client) await redisClient();
  const result = await client.exists(key);
  return result === 1;
};

module.exports = {
  setAsync,
  getAsync,
  delAsync,
  hasAsync,
};
