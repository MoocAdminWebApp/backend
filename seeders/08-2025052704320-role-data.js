"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("roles", [
      {
        roleName: "Admin",
        description: "System administrator with full access",
        status: true,
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: "Teacher",
        description:
          "Teachers have full access to the course menu, and READ-ONLY access to user/role/permission/menu",
        status: true,
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: "Observer",
        description: "Default user role that only has READ access to all the modules",
        status: true,
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
