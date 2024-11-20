module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        type: {
            type: DataTypes.STRING,
        },
        venue: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('open', 'in-progress', 'closed'),
            defaultValue: 'open',
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'medium',
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    });
    return Ticket;
};