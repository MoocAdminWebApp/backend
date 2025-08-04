const profileService = require("../service/profileService");
const { getCurrentUser } = require("../common/getCurrentUser");

// Create new profile
const createProfile = async (req, res) => {
  const creatorId = getCurrentUser(req).userId;
  const result = await profileService.createProfileAsync(req.body, creatorId);
  res.sendCommonValue(201, result.message, result.data);
};

// Get all profiles
const getAllProfiles = async (req, res) => {
  const result = await profileService.getAllProfilesAsync();
  res.sendCommonValue(200, result.message, result.data);
};

// Get profile by userId
const getProfileByUserId = async (req, res) => {
  const userId = req.params.userId;
  const result = await profileService.getProfileByUserIdAsync(userId);
  res.sendCommonValue(200, result.message, result.data);
};

// Get profile by profileId
const getProfileById = async (req, res) => {
  const result = await profileService.getProfileByIdAsync(req.params.id);
  res.sendCommonValue(200, result.message, result.data);
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
  res.sendCommonValue(200, result.message, result.data);
};

// Update profile
const updateProfile = async (req, res) => {
  const updaterId = getCurrentUser(req).userId;
  const result = await profileService.updateProfileAsync(req.params.id, req.body, updaterId);
  res.sendCommonValue(200, result.message, result.data);
};

// Update profile by userId
const updateProfileByUserId = async (req, res) => {
  const updaterId = getCurrentUser(req).userId;
  const result = await profileService.updateProfileByUserIdAsync(
    req.params.userId,
    req.body,
    updaterId
  );
  res.sendCommonValue(200, result.message, result.data);
};

// Upload avatar image and update profile
const uploadProfileAvatar = async (req, res) => {
  try {
    const userId = getCurrentUser(req).userId;
    const file = req.file;

    if (!file) {
      return res.sendCommonValue(400, "No file uploaded");
    }

    // get the path of the uploaded file,the file is saved in the uploads/avatars directory by multer
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    // just update profile with avatar path
    const result = await profileService.updateProfileAvatarAsync(userId, avatarUrl);
    res.sendCommonValue(200, result.message, result.data);
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.sendCommonValue(500, error.message);
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  const result = await profileService.deleteProfileAsync(req.params.id);
  res.sendCommonValue(200, result.message, result.data);
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileByUserId,
  getProfileById,
  getProfilesByPage,
  updateProfile,
  updateProfileByUserId,
  uploadProfileAvatar,
  deleteProfile,
};
