'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      'users',
      [
        {
          email: 'alice@example.com',
          password: 'password123',
          userName: 'Alice',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'bob@example.com',
          password: 'password456',
          userName: 'Bob',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'charlie@example.com',
          password: 'password789',
          userName: 'Charlie',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'diana@example.com',
          password: '123password',
          userName: 'Diana',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'edward@example.com',
          password: 'securePass!',
          userName: 'Edward',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
