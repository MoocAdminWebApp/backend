'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('course_offerings','createdBy',{
      type:Sequelize.INTEGER,
      allowNull:true,
      references:{
        model:'users',
        key:'id',
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL',
    });

    await queryInterface.addColumn('course_offerings','updatedBy',{
      type:Sequelize.INTEGER,
      allowNull:true,
      references:{
        model:'users',
        key:'id',
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL',
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('course_offerings','createdBy');
    await queryInterface.removeColumn('course_offerings','updatedBy');
  }
};
