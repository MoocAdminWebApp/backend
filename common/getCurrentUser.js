function getCurrentUser(req) {
  if (req.auth) {
    return {
      userId: req.auth.userId,
      email: req.auth.email,
      firstName: req.auth.firstName,
      lastName: req.auth.lastName,
    };
  }
  return { userId: null, email: null, firstName: null, lastName: null };
}

module.exports = { getCurrentUser };
