const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ticket_management', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Ticket = require('./ticket')(sequelize, Sequelize);
db.TicketAssignment = require('./ticketAssignment')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Ticket, { foreignKey: 'createdBy' });
db.Ticket.belongsTo(db.User, { foreignKey: 'createdBy' });

db.Ticket.belongsToMany(db.User, {
    through: db.TicketAssignment,
    foreignKey: 'ticketId',
});
db.User.belongsToMany(db.Ticket, {
    through: db.TicketAssignment,
    foreignKey: 'userId',
});

module.exports = db;