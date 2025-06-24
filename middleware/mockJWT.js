/**
 * mockJwt.js
 * 
 * This middleware is for development purposes only.
 * It simulates a logged-in user by injecting a mock `req.user` object.
 */

module.exports = (req, res, next) => {
    // Simulate a logged-in user
    req.user = {
      id: 1,               // mock user ID
      username: "devuser", // mock username
      roles: ["admin"],    // mock roles
    };
  
    // Proceed to next middleware
    next();
  };