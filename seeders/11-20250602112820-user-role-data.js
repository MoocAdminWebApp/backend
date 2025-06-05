"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UserRoles', [
      {
        roleId: 1,
        userId: 1,
        createBy: 1,
        updateBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: 2,
        userId: 1,
        createBy: 1,
        updateBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserRoles', null, {});
  },
};