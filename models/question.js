const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/sequelizedb')

const Question = sequelize.define(
    'Question',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('single', 'multiple', 'truefalse', 'shortanswer'),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    { timestamps: true, tableName: 'Question'}
)

Question.associate = (models) => {
    Question.hasMany(models.Option, {
        foreignKey: 'questionId',
        onDelete: 'CASCADE'
    })

    Question.belongsToMany(models.Course, {
        through: 'CourseQuestion',
        foreignKey: 'questionId',
        otherKey: 'courseId'
    })
}

module.exports = Question