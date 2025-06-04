'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {[
    {
      roleId: 1,
      permissionId: 1,
    },
    {
      roleId: 1,
      permissionId: 2,
    },
    {
      roleId: 2,
      permissionId: 1,
    },
  ];
},

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('RolePermissions', null, {});
  }
};
