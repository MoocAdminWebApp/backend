const { User, Role, Profile } = require("../models/index.js");
const { Op } = require("sequelize");
const { paginateModelAsync } = require("../common/pagination");

const {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} = require("../common/commonError.js");

const bcrypt = require("bcryptjs");
const { bcryptConfig } = require("../appConfig");

// function getALLCacheKey() {
//   //Return all cached keys
//   return "user_all";
// }
const createUserAsync = async (userData, creatorId) => {
  const existing = await User.findOne({ where: { email: userData.email } });
  if (existing) throw new EntityAlreadyExistsException("A user with this email already exists");

  const hashedPassword = await bcrypt.hash(userData.password, bcryptConfig.saltRounds);

  //Extract the role ID array and remove it from userData
  const { roleIds, ...userDataWithoutRoles } = userData;

  const newUser = await User.create({
    ...userDataWithoutRoles,
    password: hashedPassword,
    createdBy: creatorId || null,
  });

  //await cacheHelper.delAsync(getALLCacheKey());

  //If there is role data, set the user role association
  if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
    //Verify that the role ID exists
    const validRoles = await Role.findAll({
      where: { id: { [Op.in]: roleIds } },
    });

    if (validRoles.length !== roleIds.length) {
      //If there is an invalid role ID, delete the created user and throw an error
      await newUser.destroy();
      throw new EntityNotFoundException("One or more role IDs are invalid");
    }

    //Setting up user role associations
    await Promise.all(
      roleIds.map(roleId => {
        return newUser.addRole(roleId, {
          through: { createdBy: creatorId || null },
        });
      })
    );
  }

  // Re-obtain user data (including role information)
  const userWithRoles = await User.findByPk(newUser.id, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Role,
        as: "roles",
        through: { attributes: [] },
        attributes: ["id", "roleName", "description"],
      },
    ],
  });

  return {
    isSuccess: userWithRoles.id > 0 ? true : false,
    message: "create user successfully",
    data: userWithRoles,
  };
};

const getAllUsersAsync = async () => {
  // let cacheValue = await cacheHelper.getAsync(getALLCacheKey());
  // if (cacheValue) {
  //   return { isSuccess: true, message: "", data: JSON.parse(cacheValue) };
  // }
  var allUsers = await User.findAll({
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Role,
        as: "roles",
        through: { attributes: [] },
        attributes: ["id", "roleName", "description"],
      },
      { model: User, as: "creator", attributes: ["id", "firstName", "lastName", "access"] },
      { model: User, as: "updater", attributes: ["id", "firstName", "lastName", "access"] },
    ],
    order: [["id", "ASC"]],
  });

  //await cacheHelper.setAsync(getALLCacheKey(), JSON.stringify(allUsers), 10);
  return { isSuccess: true, message: "get all users successfully", data: allUsers };
};

// get user by email only used in register, login or reset password
const getUserByEmailAsync = async email => {
  const user = await User.findOne({ where: { email: email.trim() } });
  if (!user) throw new EntityNotFoundException("User with this email not found", 404);
  return { isSuccess: true, message: "", data: user };
};

const getUserByIdAsync = async id => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Role,
        as: "roles",
        through: { attributes: [] },
        attributes: ["id", "roleName", "description"],
      },
      { model: Profile, as: "profile" },
      { model: User, as: "creator", attributes: ["id", "firstName", "lastName", "access"] },
      { model: User, as: "updater", attributes: ["id", "firstName", "lastName", "access"] },
    ],
  });

  if (!user) throw new EntityNotFoundException("User with this id not found");

  return { isSuccess: true, message: "Get user by id successfully", data: user };
};
const getUsersByPageAsync = async (filters = {}, fuzzyKeys = [], page, pageSize) => {
  return await paginateModelAsync(User, {
    filters,
    fuzzyKeys,
    page,
    pageSize,
    excludeFields: ["password"],
    include: [
      {
        model: Role,
        as: "roles",
        through: { attributes: [] },
        attributes: ["id", "roleName", "description"],
      },
      { model: User, as: "creator", attributes: ["id", "firstName", "lastName", "access"] },
      { model: User, as: "updater", attributes: ["id", "firstName", "lastName", "access"] },
    ],
    orderBy: "id",
    orderDir: "ASC",
  });
};

const updateUserRoles = async (user, newRoleIds, updaterId) => {
  // 1. Get existing associations
  const currentRoles = await user.getRoles({
    joinTableAttributes: ["id", "createdBy", "updatedBy"],
  });
  const currentRoleIds = currentRoles.map(r => r.id);

  // 2. Calculate the difference
  const rolesToAdd = newRoleIds.filter(id => !currentRoleIds.includes(id));
  const rolesToRemove = currentRoleIds.filter(id => !newRoleIds.includes(id));
  const rolesToKeep = currentRoleIds.filter(id => newRoleIds.includes(id));

  // 3. Delete unnecessary role associations
  if (rolesToRemove.length > 0) {
    await user.removeRoles(rolesToRemove);
  }

  // 4. Add a new role and set createdBy and updatedBy
  for (const roleId of rolesToAdd) {
    await user.addRole(roleId, {
      through: { createdBy: updaterId, updatedBy: updaterId },
    });
  }

  // 5. For retained roles, update the updatedBy field
  for (const roleId of rolesToKeep) {
    // Update the updatedBy field of the intermediate table
    await user.sequelize.models.UserRole.update(
      { updatedBy: updaterId },
      {
        where: { userId: user.id, roleId },
      }
    );
  }
};

const updateUserAsync = async (id, updateData, updaterId) => {
  const user = await User.findByPk(id);
  if (!user) throw new EntityNotFoundException("User with this idnot found");

  //id and email cannot be updated
  delete updateData.id;
  delete updateData.email;

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, bcryptConfig.saltRounds);
  }
  const { roleIds, ...updateDataWithoutRoles } = updateData;

  await user.update({
    ...updateDataWithoutRoles,
    updatedBy: updaterId,
  });

  // If there is role data, update the user role association
  // Allows passing an empty array to clear all roles
  if (roleIds !== undefined) {
    if (Array.isArray(roleIds)) {
      if (roleIds.length > 0) {
        // Verify that the role ID exists
        const validRoles = await Role.findAll({
          where: { id: { [Op.in]: roleIds } },
        });

        if (validRoles.length !== roleIds.length) {
          throw new EntityNotFoundException("One or more role IDs are invalid");
        }
      }

      // Update user role associations
      //donot use await user.setRoles([]); it will clear existing roles,so the createBy info is missing
      await updateUserRoles(user, roleIds, updaterId);
    }
  }
  // Re-obtain user data (including role information)
  const updatedUserWithRoles = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Role,
        as: "roles",
        through: { attributes: [] },
        attributes: ["id", "roleName", "description"],
      },
      { model: User, as: "creator", attributes: ["id", "firstName", "lastName", "access"] },
      { model: User, as: "updater", attributes: ["id", "firstName", "lastName", "access"] },
    ],
  });

  return { isSuccess: true, message: "User updated successfully", data: updatedUserWithRoles };
};

const deleteUserAsync = async id => {
  const user = await User.findByPk(id);
  if (!user) throw new EntityNotFoundException("User with this id not found");
  await user.destroy();
  return { isSuccess: true, message: "User deleted successfully", data: user };
};

module.exports = {
  createUserAsync,
  getAllUsersAsync,
  getUserByEmailAsync,
  getUserByIdAsync,
  getUsersByPageAsync,
  updateUserAsync,
  deleteUserAsync,
};
