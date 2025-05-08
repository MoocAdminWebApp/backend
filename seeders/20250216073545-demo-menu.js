"use strict";

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
      "Menu",
      [
        {
          title: "Demo Menu",
          parentId: null,
          permission: "",
          route: "",
          componentPath: "",
          menuType: "Dir",
          orderNum: 0,
        },
        {
          title: "Demo",
          permission: "Demo.Page",
          parentId: 1,
          route: "Demo",
          componentPath: "./pages/demo/index.jsx",
          menuType: "Menu",
          orderNum: 0,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    //  await queryInterface.bulkDelete("user", null, {});
    await queryInterface.bulkDelete("Menu", null, {});
    // delete table if necessary   to use reset-db command in package.json
    await queryInterface.dropTable("Menu");
  },
};
