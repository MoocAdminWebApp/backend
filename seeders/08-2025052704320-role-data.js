"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      {
        roleName: 'Admin',
        description: 'System Administrator',
        status: true,
        createBy: 1,
        updateBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: 'Editor',
        description: 'Content Editor',
        status: true,
        createBy: 1,
        updateBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: 'Viewer',
        description: 'Read-only user',
        status: true,
        createBy: 1,
        updateBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};