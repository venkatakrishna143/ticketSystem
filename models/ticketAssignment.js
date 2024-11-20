module.exports = (sequelize, DataTypes) => {
    const TicketAssignment = sequelize.define('TicketAssignment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        ticketId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    });
    return TicketAssignment;
};