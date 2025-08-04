const { Profile, User } = require("../models/index.js");
const { Op } = require("sequelize");
const { paginateModelAsync } = require("../common/pagination");

const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} = require("../common/commonError.js");

const createProfileAsync = async (profileData, creatorId) => {
  // one profile per user
  const existing = await Profile.findOne({ where: { userId: profileData.userId } });
  if (existing) throw new EntityAlreadyExistsException("A profile for this user already exists");

  const newProfile = await Profile.create({
    ...profileData,
    createdBy: creatorId || null,
  });

  return {
    isSuccess: true,
    message: "Profile created successfully",
    data: newProfile,
  };
};

const getAllProfilesAsync = async () => {
  const allProfiles = await Profile.findAll({
    include: [
      { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName", "access"] },
      { model: User, as: "creator", attributes: ["id", "email", "access"] },
      { model: User, as: "updater", attributes: ["id", "email", "access"] },
    ],
    order: [["id", "ASC"]],
  });

  return { isSuccess: true, message: "Get all profiles successfully", data: allProfiles };
};

const getProfileByIdAsync = async id => {
  const profile = await Profile.findByPk(id, {
    include: [
      { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName", "access"] },
      { model: User, as: "creator", attributes: ["id", "email", "access"] },
      { model: User, as: "updater", attributes: ["id", "email", "access"] },
    ],
  });

  if (!profile) throw new EntityNotFoundException("Profile with this id not found");

  return { isSuccess: true, message: "Get profile by id successfully", data: profile };
};

const getProfileByUserIdAsync = async userId => {
  const profile = await Profile.findOne({
    where: { userId },
    include: [
      { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName", "access"] },
      { model: User, as: "creator", attributes: ["id", "email", "access"] },
      { model: User, as: "updater", attributes: ["id", "email", "access"] },
    ],
  });

  if (!profile) throw new EntityNotFoundException("Profile with this userId not found");

  return { isSuccess: true, message: "Get profile by user id successfully", data: profile };
};

const getProfilesByPageAsync = async (filters = {}, fuzzyKeys = [], page = 1, pageSize = 10) => {
  return await paginateModelAsync(Profile, {
    filters,
    fuzzyKeys,
    page,
    pageSize,
    excludeFields: [],
    include: [
      { model: User, as: "user", attributes: ["id", "email"] },
      { model: User, as: "creator", attributes: ["id", "email"] },
      { model: User, as: "updater", attributes: ["id", "email"] },
    ],
    orderBy: "id",
    orderDir: "ASC",
  });
};
const updateProfileAsync = async (id, updateData, updaterId) => {
  const profile = await Profile.findByPk(id);
  if (!profile) throw new EntityNotFoundException("Profile with this id not found");

  await profile.update({
    ...updateData,
    updatedBy: updaterId,
  });

  return {
    isSuccess: true,
    message: "Profile updated successfully",
    data: profile,
  };
};

const updateProfileByUserIdAsync = async (userId, updateData, updaterId) => {
  const profile = await Profile.findOne({ where: { userId } });
  if (!profile) throw new EntityNotFoundException("Profile not found for user");

  await profile.update({
    ...updateData,
    updatedBy: updaterId,
  });

  return {
    isSuccess: true,
    message: "Profile updated successfully",
    data: profile,
  };
};

const updateProfileAvatarAsync = async (userId, avatarUrl) => {
  const profile = await Profile.findOne({ where: { userId } });
  if (!profile) throw new EntityNotFoundException("Profile not found for user");

  // just update the avatar url field
  await profile.update({ avatar: avatarUrl });

  return {
    isSuccess: true,
    message: "Avatar uploaded and profile updated",
    data: { avatar: avatarUrl },
  };
};

const deleteProfileAsync = async id => {
  const profile = await Profile.findByPk(id);
  if (!profile) throw new EntityNotFoundException("Profile with this id not found");

  await profile.destroy();

  return {
    isSuccess: true,
    message: "Profile deleted successfully",
    data: profile,
  };
};

module.exports = {
  createProfileAsync,
  getAllProfilesAsync,
  getProfileByIdAsync,
  getProfileByUserIdAsync,
  getProfilesByPageAsync,
  updateProfileAsync,
  updateProfileByUserIdAsync,
  updateProfileAvatarAsync,
  deleteProfileAsync,
};
