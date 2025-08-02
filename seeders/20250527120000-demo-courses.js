"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("courses", [
      {
        courseCode: "JS-BASICS",
        courseName: "JavaScript Basics",
        courseDescription: "Learn the fundamentals of JavaScript.",
        instructorId: 1,
        status: "PUBLISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseCode: "REACT-ADV",
        courseName: "Advanced React",
        courseDescription: "Hooks, Context, and performance optimization.",
        instructorId: 2,
        status: "DRAFT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseCode: "NODE-EXPRESS",
        courseName: "Node.js + Express",
        courseDescription: "Backend development with Node.js and Express.",
        instructorId: 3,
        status: "ARCHIVED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("courses", {
      courseCode: ["JS-BASICS", "REACT-ADV", "NODE-EXPRESS"],
    });
  },
};
