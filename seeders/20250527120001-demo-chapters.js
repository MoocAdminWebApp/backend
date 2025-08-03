"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "chapters",
      [
        // 课程 1 的章节（你已给出，这里保留）
        {
          chapterNumber: 1,
          title: "Introduction to JavaScript",
          description: "Welcome to JavaScript programming",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "What is JavaScript?",
              "Setting up development environment",
              "Writing your first program",
            ],
          }),
          videoUrl: "https://example.com/videos/js-intro.mp4",
          duration: 25,
          orderNum: 1,
          status: "PUBLISHED",
          createdBy: 1,
          updatedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 2,
          title: "JavaScript Basics",
          description: "Variables, data types, and operators",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "Declaring variables",
              "Data types in JavaScript",
              "Operators and expressions",
            ],
          }),
          videoUrl: "https://example.com/videos/js-basics.mp4",
          duration: 30,
          orderNum: 2,
          status: "PUBLISHED",
          createdBy: 1,
          updatedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 3,
          title: "Control Flow",
          description: "Learn how to use conditionals and loops",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "If-else statements",
              "Switch case",
              "Loops: for, while, do-while",
            ],
          }),
          videoUrl: "https://example.com/videos/js-flow.mp4",
          duration: 35,
          orderNum: 3,
          status: "DRAFT",
          createdBy: 2,
          updatedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 4,
          title: "Functions and Scope",
          description: "Understanding functions and variable scope",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "Function declaration and expressions",
              "Arrow functions",
              "Scope and closures",
            ],
          }),
          videoUrl: "https://example.com/videos/js-functions.mp4",
          duration: 40,
          orderNum: 4,
          status: "PUBLISHED",
          createdBy: 1,
          updatedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 5,
          title: "DOM Manipulation",
          description: "Interacting with the webpage",
          courseId: 1,
          content: JSON.stringify({
            sections: [
              "Document Object Model",
              "Selecting elements",
              "Updating content dynamically",
            ],
          }),
          videoUrl: "https://example.com/videos/dom.mp4",
          duration: 50,
          orderNum: 5,
          status: "HIDDEN",
          createdBy: 3,
          updatedBy: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // 课程 2 - Advanced React 的章节
        {
          chapterNumber: 1,
          title: "React Hooks Overview",
          description: "Understanding useState, useEffect and other hooks",
          courseId: 2,
          content: JSON.stringify({
            sections: [
              "Introduction to Hooks",
              "useState and useEffect",
              "Rules of Hooks",
            ],
          }),
          videoUrl: "https://example.com/videos/react-hooks.mp4",
          duration: 40,
          orderNum: 1,
          status: "PUBLISHED",
          createdBy: 2,
          updatedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 2,
          title: "Context API and useContext",
          description: "Managing global state with React Context",
          courseId: 2,
          content: JSON.stringify({
            sections: [
              "What is Context API?",
              "Creating and using Context",
              "Common use cases",
            ],
          }),
          videoUrl: "https://example.com/videos/react-context.mp4",
          duration: 35,
          orderNum: 2,
          status: "PUBLISHED",
          createdBy: 2,
          updatedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 3,
          title: "Performance Optimization",
          description: "Memoization and code splitting techniques",
          courseId: 2,
          content: JSON.stringify({
            sections: [
              "React.memo",
              "useMemo and useCallback",
              "Lazy loading components",
            ],
          }),
          videoUrl: "https://example.com/videos/react-performance.mp4",
          duration: 45,
          orderNum: 3,
          status: "DRAFT",
          createdBy: 2,
          updatedBy: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // 课程 3 - Node.js + Express 的章节
        {
          chapterNumber: 1,
          title: "Introduction to Node.js",
          description: "What is Node.js and why use it",
          courseId: 3,
          content: JSON.stringify({
            sections: [
              "Node.js overview",
              "Event-driven architecture",
              "Setup Node.js environment",
            ],
          }),
          videoUrl: "https://example.com/videos/node-intro.mp4",
          duration: 30,
          orderNum: 1,
          status: "PUBLISHED",
          createdBy: 3,
          updatedBy: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 2,
          title: "Express Framework Basics",
          description: "Building web servers with Express",
          courseId: 3,
          content: JSON.stringify({
            sections: [
              "Express installation",
              "Routing basics",
              "Middleware functions",
            ],
          }),
          videoUrl: "https://example.com/videos/express-basics.mp4",
          duration: 40,
          orderNum: 2,
          status: "PUBLISHED",
          createdBy: 3,
          updatedBy: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapterNumber: 3,
          title: "Working with Databases",
          description: "Connecting Node.js with databases",
          courseId: 3,
          content: JSON.stringify({
            sections: [
              "Using Sequelize ORM",
              "CRUD operations",
              "Database migrations",
            ],
          }),
          videoUrl: "https://example.com/videos/node-db.mp4",
          duration: 50,
          orderNum: 3,
          status: "DRAFT",
          createdBy: 3,
          updatedBy: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("chapters", null, {});
  },
};
