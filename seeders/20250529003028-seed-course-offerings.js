'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('CourseOfferings', [
      {
        courseName: 'JavaScript Basic',
        teacherName: 'Alice Johnson',
        semester: 'Spring 2025',
        capacity: 30,
        enrolledCount: 15,
        location: 'Room A101',
        schedule: 'Mon 10:00 - 12:00',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseName: 'React Frontend',
        teacherName: 'Bob Smith',
        semester: 'Spring 2025',
        capacity: 25,
        enrolledCount: 20,
        location: 'Room B202',
        schedule: 'Tue 14:00 - 16:00',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseName: 'Node.js Backend',
        teacherName: 'Carol Lee',
        semester: 'Summer 2025',
        capacity: 40,
        enrolledCount: 40,
        location: 'Room C303',
        schedule: 'Wed 09:00 - 11:00',
        status: 'closed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseName: 'Java programming',
        teacherName: 'David Chen',
        semester: 'Fall 2025',
        capacity: 35,
        enrolledCount: 10,
        location: 'Room D404',
        schedule: 'Thu 13:00 - 15:00',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courseName: 'Python programming',
        teacherName: 'Eva Wang',
        semester: 'Fall 2025',
        capacity: 50,
        enrolledCount: 45,
        location: 'Room E505',
        schedule: 'Fri 15:00 - 17:00',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('CourseOfferings', null, {});
  }
};
