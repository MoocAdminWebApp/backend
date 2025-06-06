'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CourseOfferings', [
      {
        courseName: 'Introduction to Programming',
        teacherName: 'Alice Smith',
        semester: '2025 Fall',
        capacity: 40,
        enrolledCount: 10,
        location: 'Room 201',
        schedule: 'Monday 9:00-11:00',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseName: 'Advanced Database Systems',
        teacherName: 'Bob Johnson',
        semester: '2025 Fall',
        capacity: 35,
        enrolledCount: 15,
        location: 'Room 305',
        schedule: 'Wednesday 13:00-15:00',
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseName: 'Web Development Basics',
        teacherName: 'Carol Davis',
        semester: '2025 Fall',
        capacity: 50,
        enrolledCount: 20,
        location: 'Lab A',
        schedule: 'Friday 10:00-12:00',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CourseOfferings', null, {});
  }
};