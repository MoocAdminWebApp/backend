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
      "permissions",
      [
        {
          id: 1,
          permissionName: "user:viewall",
          description: "Permission to viewall user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          permissionName: "user:create",
          description: "Permission to create user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          permissionName: "user:view",
          description: "Permission to view user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          permissionName: "user:update",
          description: "Permission to update user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          permissionName: "user:delete",
          description: "Permission to delete user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          permissionName: "role:viewall",
          description: "Permission to viewall role",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          permissionName: "role:create",
          description: "Permission to create role",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          permissionName: "role:view",
          description: "Permission to view role",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          permissionName: "role:update",
          description: "Permission to update role",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          permissionName: "role:delete",
          description: "Permission to delete role",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 11,
          permissionName: "menu:viewall",
          description: "Permission to viewall menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 12,
          permissionName: "menu:create",
          description: "Permission to create menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 13,
          permissionName: "menu:view",
          description: "Permission to view menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 14,
          permissionName: "menu:update",
          description: "Permission to update menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 15,
          permissionName: "menu:delete",
          description: "Permission to delete menu",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 16,
          permissionName: "permission:viewall",
          description: "Permission to viewall permission",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 17,
          permissionName: "permission:create",
          description: "Permission to create permission",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 18,
          permissionName: "permission:view",
          description: "Permission to view permission",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 19,
          permissionName: "permission:update",
          description: "Permission to update permission",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 20,
          permissionName: "permission:delete",
          description: "Permission to delete permission",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 21,
          permissionName: "course:viewall",
          description: "Permission to viewall course",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 22,
          permissionName: "course:create",
          description: "Permission to create course",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 23,
          permissionName: "course:view",
          description: "Permission to view course",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 24,
          permissionName: "course:update",
          description: "Permission to update course",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 25,
          permissionName: "course:delete",
          description: "Permission to delete course",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 26,
          permissionName: "category:viewall",
          description: "Permission to viewall category",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 27,
          permissionName: "category:create",
          description: "Permission to create category",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 28,
          permissionName: "category:view",
          description: "Permission to view category",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 29,
          permissionName: "category:update",
          description: "Permission to update category",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 30,
          permissionName: "category:delete",
          description: "Permission to delete category",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 31,
          permissionName: "chapter:viewall",
          description: "Permission to viewall chapter",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 32,
          permissionName: "chapter:create",
          description: "Permission to create chapter",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 33,
          permissionName: "chapter:view",
          description: "Permission to view chapter",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 34,
          permissionName: "chapter:update",
          description: "Permission to update chapter",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 35,
          permissionName: "chapter:delete",
          description: "Permission to delete chapter",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 36,
          permissionName: "courseoffering:viewall",
          description: "Permission to viewall courseoffering",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 37,
          permissionName: "courseoffering:create",
          description: "Permission to create courseoffering",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 38,
          permissionName: "courseoffering:view",
          description: "Permission to view courseoffering",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 39,
          permissionName: "courseoffering:update",
          description: "Permission to update courseoffering",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 40,
          permissionName: "courseoffering:delete",
          description: "Permission to delete courseoffering",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 41,
          permissionName: "carousel:viewall",
          description: "Permission to viewall carousel",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 42,
          permissionName: "carousel:create",
          description: "Permission to create carousel",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 43,
          permissionName: "carousel:view",
          description: "Permission to view carousel",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 44,
          permissionName: "carousel:update",
          description: "Permission to update carousel",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 45,
          permissionName: "carousel:delete",
          description: "Permission to delete carousel",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 46,
          permissionName: "questionbank:viewall",
          description: "Permission to viewall questionbank",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 47,
          permissionName: "questionbank:create",
          description: "Permission to create questionbank",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 48,
          permissionName: "questionbank:view",
          description: "Permission to view questionbank",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 49,
          permissionName: "questionbank:update",
          description: "Permission to update questionbank",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 50,
          permissionName: "questionbank:delete",
          description: "Permission to delete questionbank",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 51,
          permissionName: "user:assign",
          description: "Permission to assign user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 52,
          permissionName: "role:assign",
          description: "Permission to assign role",
          createdAt: new Date(),
          updatedAt: new Date(),
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
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
