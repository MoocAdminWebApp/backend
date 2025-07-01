"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("course_offerings", [
      {
        courseName: "Introduction to Programming",
        teacherName: "Alice Smith",
        semester: "2026 First",
        capacity: 40,
        enrolledCount: 10,
        location: "Room 201",
        schedule: "5/3/2026-5/6/2026",
        status: 0,
        createdBy: 1,
        updatedBy: 1,
        courseId: 1
      },
      {
        courseName: "Advanced Database Systems",
        teacherName: "Bob Johnson",
        semester: "2026 First",
        capacity: 35,
        enrolledCount: 15,
        location: "Room 305",
        schedule: "7/4/2026-20/6/2026",
        status: 0,
        createdBy: 1,
        updatedBy: 1,
        courseId: 1
      },
      {
        courseName: "Web Development Basics",
        teacherName: "Carol Davis",
        semester: "2026 Second",
        capacity: 50,
        enrolledCount: 20,
        location: "Lab A",
        schedule: "5/9/2026-5/12/2026",
        status: 1,
        createdBy: 1,
        updatedBy: 1,
        courseId: 1
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('course_offerings', null, {});
  }
};
