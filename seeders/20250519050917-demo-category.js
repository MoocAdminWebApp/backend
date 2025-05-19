"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Category",
      [
        // Top-level categories
        {
          id: 1,
          name: "Programming",
          description: "Programming related courses",
          parentId: null,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "Design",
          description: "Design and creativity",
          parentId: null,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: "Business",
          description: "Business and management",
          parentId: null,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Subcategories of Programming
        {
          id: 2,
          name: "Frontend",
          description: "Frontend development courses",
          parentId: 1,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "React",
          description: "React framework tutorials",
          parentId: 2,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Backend",
          description: "Backend development topics",
          parentId: 1,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "DevOps",
          description: "Deployment and infrastructure",
          parentId: 1,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Subcategories of Design
        {
          id: 7,
          name: "UI/UX",
          description: "User interface and experience",
          parentId: 6,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: "Graphic Design",
          description: "Illustration and visual design",
          parentId: 6,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Subcategories of Business
        {
          id: 10,
          name: "Marketing",
          description: "Marketing strategies and tools",
          parentId: 9,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 11,
          name: "Finance",
          description: "Finance and accounting basics",
          parentId: 9,
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Category", null, {});
  },
};
