'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      menu.belongsTo(models.user, { foreignKey: 'createdBy', targetKey: 'id' });
      menu.belongsTo(models.user, { foreignKey: 'updatedBy', targetKey: 'id' });

      menu.belongsTo(models.menu, { foreignKey: 'parentId', as: 'parent' });
      menu.hasMany(models.menu, { foreignKey: 'parentId', as: 'children' });
    }
  }
  menu.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('directory', 'menu', 'button'),
        allowNull: false,
        get() {
          const type = this.getDataValue('type');
          const typeToNumber = {
            directory: 1,
            menu: 2,
            button: 3,
          };
          return typeToNumber[type];
        },
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'menus',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      orderNum: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      component: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      permission: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'draft', 'archived'),
        allowNull: false,
        defaultValue: 'active',
        get() {
          const status = this.getDataValue('status');
          const statusToNumber = {
            active: 1,
            inactive: 2,
            draft: 3,
            archived: 4,
          };
          return statusToNumber[status];
        },
      },
      comment: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'menu',
      tableName: 'Menus',
    },
  );
  return menu;
};
