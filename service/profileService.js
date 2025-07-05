const { Profile, User } = require("../models/index.js");
const { Op } = require("sequelize");

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
    updatedBy: creatorId || null,
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
      { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName"] },
      { model: User, as: "creator", attributes: ["id", "email"] },
      { model: User, as: "updater", attributes: ["id", "email"] },
    ],
    order: [["id", "ASC"]],
  });

  return { isSuccess: true, message: "", data: allProfiles };
};

const getProfileByIdAsync = async id => {
  const profile = await Profile.findByPk(id, {
    include: [
      { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName"] },
      { model: User, as: "creator", attributes: ["id", "email"] },
      { model: User, as: "updater", attributes: ["id", "email"] },
    ],
  });

  if (!profile) throw new EntityNotFoundException("Profile with this id not found");

  return { isSuccess: true, message: "", data: profile };
};

const getProfileByUserIdAsync = async userId => {
  const profile = await Profile.findOne({
    where: { userId },
    include: [
      { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName"] },
      { model: User, as: "creator", attributes: ["id", "email"] },
      { model: User, as: "updater", attributes: ["id", "email"] },
    ],
  });

  if (!profile) throw new EntityNotFoundException("Profile with this userId not found");

  return { isSuccess: true, message: "", data: profile };
};

// const getProfilesByPageAsync = async (page = 1, pageSize = 10) => {
//   const offset = (page - 1) * pageSize;

//   const { count, rows } = await Profile.findAndCountAll({
//     offset,
//     limit: pageSize,
//     order: [["id", "ASC"]],
//     include: [
//       { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName"] },
//       { model: User, as: "creator", attributes: ["id", "email"] },
//       { model: User, as: "updater", attributes: ["id", "email"] },
//     ],
//   });

//   const data = {
//     page,
//     pageSize,
//     totalPages: Math.ceil(count / pageSize),
//     total: count,
//     profiles: rows,
//   };

//   return { isSuccess: true, message: "", data };
// };

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

  // change id and userId are forbidden
  delete updateData.id;
  delete updateData.userId;

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
  deleteProfileAsync,
};
