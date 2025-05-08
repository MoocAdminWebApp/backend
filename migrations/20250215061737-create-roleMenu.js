'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RoleMenu', {
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Role',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            menuId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Menu',
                    key: 'id',
                },
                onDelete: 'CASCADE',
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

        await queryInterface.addConstraint('RoleMenu', {
            fields: ['roleId', 'menuId'],
            type: 'primary key',
            name: 'pk_roleMenu',
        });

        console.log("Table RoleMenu Created");

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('RoleMenu');
    },
};
