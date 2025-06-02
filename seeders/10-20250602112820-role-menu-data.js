'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RoleMenus', [
      {
        roleId: 1,
        menuId: 1,
      },
      {
        roleId: 1,
        menuId: 2,
      },
      {
        roleId: 2,
        menuId: 3,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoleMenus', null, {});
  }
};
