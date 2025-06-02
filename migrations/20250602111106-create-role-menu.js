'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('RoleMenus', {
      menuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Menus', key: 'id' },
        onDelete: 'CASCADE'
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Role', key: 'id' },
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('RoleMenus');
  }
};
