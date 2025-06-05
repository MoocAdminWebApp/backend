"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;

    const users = [
      {
        email: "alice@example.com",
        password: bcrypt.hashSync("password123", saltRounds),
        firstName: "Alice",
        lastName: "Anderson",
        access: "admin",
        active: true,
        createdBy: null,
        updatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "bob@example.com",
        password: bcrypt.hashSync("password456", saltRounds),
        firstName: "Bob",
        lastName: "Brown",
        access: "teacher",
        active: true,
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "charlie@example.com",
        password: bcrypt.hashSync("password789", saltRounds),
        firstName: "Charlie",
        lastName: "Clark",
        access: "student",
        active: true,
        createdBy: 1,
        updatedBy: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "diana@example.com",
        password: bcrypt.hashSync("123password", saltRounds),
        firstName: "Diana",
        lastName: "Davis",
        access: "teacher",
        active: false,
        createdBy: 2,
        updatedBy: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "edward@example.com",
        password: bcrypt.hashSync("securePass!", saltRounds),
        firstName: "Edward",
        lastName: "Evans",
        access: "student",
        active: false,
        createdBy: 1,
        updatedBy: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
