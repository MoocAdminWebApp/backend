'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Role', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            roleName: {
                type: Sequelize.STRING(50),
                unique: true,
                allowNull: false,
            },
            mark: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
        console.log("Table Role Created");
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Role');
    },
};
