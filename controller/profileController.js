const profileService = require("../service/profileService");
const { getCurrentUser } = require("../common/getCurrentUser");

// Create new profile
const createProfile = async (req, res) => {
  const creatorId = getCurrentUser(req).userId;
  const result = await profileService.createProfileAsync(req.body, creatorId);
  if (result.isSuccess) {
    res.sendCommonValue(201, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

// Get all profiles
const getAllProfiles = async (req, res) => {
  const result = await profileService.getAllProfilesAsync();

  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(500, "fail");
  }
};

// Get profile by userId
const getProfileByUserId = async (req, res) => {
  const userId = req.params.userId;
  const result = await profileService.getProfileByUserIdAsync(userId);

  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(404, "fail");
  }
};

// Get profile by profileId
const getProfileById = async (req, res) => {
  const result = await profileService.getProfileByIdAsync(req.params.id);

  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(404, "fail");
  }
};

// Get profiles by page
const getProfilesByPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  let filters = {};
  if (typeof req.query.filters === "string") {
    try {
      filters = JSON.parse(req.query.filters);
    } catch (err) {
      return res.sendCommonValue(400, "Invalid filters format");
    }
  }

  let fuzzyKeys = req.query.fuzzyKeys || [];
  if (typeof fuzzyKeys === "string") {
    fuzzyKeys = fuzzyKeys.split(",");
  }

  const result = await profileService.getProfilesByPageAsync(filters, fuzzyKeys, page, pageSize);

  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

// Update profile
const updateProfile = async (req, res) => {
  const updaterId = getCurrentUser(req).userId;
  const result = await profileService.updateProfileAsync(req.params.id, req.body, updaterId);

  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  const result = await profileService.deleteProfileAsync(req.params.id);

  if (result.isSuccess) {
    res.sendCommonValue(200, "success", result.data);
  } else {
    res.sendCommonValue(400, "fail");
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileByUserId,
  getProfileById,
  getProfilesByPage,
  updateProfile,
  deleteProfile,
};
