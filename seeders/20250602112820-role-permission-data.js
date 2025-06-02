'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RolePermissions', [
      {
        roleId: 1,
        permissionId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1,
        permissionId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        permissionId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RolePermissions', null, {});
  }
};
