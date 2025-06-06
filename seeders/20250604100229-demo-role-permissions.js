"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("role_permissions", [
      {
        roleId: 1,
        permissionId: 1,
        createBy: 1,
        updateBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 1,
        permissionId: 2,
        createBy: 1,
        updateBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("role_permissions", null, {});
  },
};
