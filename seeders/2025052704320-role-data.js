"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Role",
      [
        {
          roleName: "Admin",
          description: "Administrator role",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: "Instructor",
          description: "Teacher role",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: "Student",
          description: "Student role",
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Role", null, {});
  },
};
