const NodeCache = require("node-cache");

const nodeCache = new NodeCache({
  stdTTL: 60, // stdTTL All caches expire in 60 seconds by default
  checkperiod: 60, // Check expired cache every 60 seconds
});

/**
 * Add cache
 * @param {*} key
 * @param {*} value
 * @param {*} ttl  second
 */
const setAsync = async (key, value, ttl = null) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  return new Promise((resolve) => {
    const success = nodeCache.set(key, value, ttl);
    resolve(success);
  });
};

/**
 * Retrieve cache based on key
 * @param {*} key
 * @returns
 */
const getAsync = async (key) => {
  return new Promise((resolve) => {
    const value = nodeCache.get(key);
    resolve(value);
  });
};

/**
 * Delete cache based on key
 * @param {*} key
 */
const delAsync = async (key) => {
  return new Promise((resolve) => {
    const value = nodeCache.del(key);
    resolve(value);
  });
};

/**
 * check key is exists
 * @param {*} key
 */
const hasAsync = async (key) => {
  return new Promise((resolve) => {
    const success = nodeCache.has(key);
    resolve(success);
  });
};

//
module.exports = {
  setAsync,
  getAsync,
  delAsync,
  hasAsync,
};
