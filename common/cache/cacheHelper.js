const { cacheConfig } = require("../../appConfig");
const redisHelper = require("./redisHelper");
const nodeCacheHelper = require("./nodeCacheHelper");

let cache;
let type = "memory";
if (cacheConfig && cacheConfig.useReids) {
  cache = redisHelper;
  type = "redis";
} else {
  cache = nodeCacheHelper;
  type = "memory";
}

/**
 * get cache value by key
 * @param {*} key 
 * @returns 
 */
async function getAsync(key) {
  return cache.getAsync(key);
}

/**
 * set cache value by key
 * @param {*} key 
 * @param {*} value 
 * @param {*} ttl  second
 * @returns 
 */

async function setAsync(key, value, ttl) {
  return cache.setAsync(key, value, ttl);
}

/**
 * delete cache value by key
 * @param {*} key 
 * @returns 
 */
async function delAsync(key) {
  return cache.delAsync(key);
}

/**
 * check key is exists
 * @param {*} key 
 * @returns 
 */
async function hasAsync(key) {
  return cache.hasAsync(key);
}

module.exports = { getAsync, setAsync, delAsync, hasAsync, type };
