"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 插入示例章节数据
    await queryInterface.bulkInsert(
      "Chapter",
      [
        // JavaScript 基础教程的章节
        {
          chapterTitle: "JavaScript 简介",
          chapterDescription: "了解JavaScript的历史和基本概念",
          courseId: 1,
          orderNum: 1,
          duration: 3600,
          status: "Published",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Chapter", null, {});
  },
};