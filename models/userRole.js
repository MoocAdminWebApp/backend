const { DataTypes } = require('sequelize');

const { sequelize } = require('../db/sequelizedb');

const UserRole = sequelize.define(
    'UserRole',
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: 'userId',
        },
        roleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: 'roleId',
        },
    },
    {
        tableName: 'UserRole',
        timestamps: false,
    }
);

// UserRole.associate = function (models) {
//     UserRole.belongsTo(models.User, { foreignKey: 'userId' });
//     UserRole.belongsTo(models.Role, { foreignKey: 'roleId' });
// };

module.exports = UserRole;
