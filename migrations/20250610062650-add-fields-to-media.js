"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('media', 'resourceType', {
      type: Sequelize.ENUM('course', 'chapter', 'section'),
      allowNull: false,
      defaultValue: 'chapter' 
    });
    
    await queryInterface.addColumn('media', 'resourceId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0  
    });
    
    await queryInterface.addColumn('media', 'status', {
      type: Sequelize.ENUM('uploading', 'processing', 'ready', 'error'),
      allowNull: false,
      defaultValue: 'ready'
    });
    
    await queryInterface.addColumn('media', 'thumbnail', {
      type: Sequelize.STRING(500),
      allowNull: true
    });
    
    await queryInterface.addColumn('media', 'isProcessed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('media', 'resourceType');
    await queryInterface.removeColumn('media', 'resourceId');
    await queryInterface.removeColumn('media', 'status');
    await queryInterface.removeColumn('media', 'thumbnail');
    await queryInterface.removeColumn('media', 'isProcessed');
  }
};