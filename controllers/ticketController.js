const { Ticket, User, TicketAssignment } = require('../models');
const { Op } = require('sequelize');

// Create Ticket
exports.createTicket = async (req, res) => {
    const { title, description, type, venue, status, priority, dueDate, createdBy } = req.body;
    try {
        const ticket = await Ticket.create({
            title,
            description,
            type,
            venue,
            status,
            priority,
            dueDate,
            createdBy,
        });
        res.json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get All Tickets
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Ticket
exports.getTicket = async (req, res) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findByPk(id, {
            include: [{ model: User, through: TicketAssignment }],
        });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        ticket.title = title || ticket.title;
        ticket.description = description || ticket.description;
        ticket.status = status || ticket.status;
        ticket.priority = priority || ticket.priority;
        ticket.dueDate = dueDate || ticket.dueDate;
        await ticket.save();

        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        await ticket.destroy();
        res.json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Assign User to Ticket
exports.assignUserToTicket = async (req, res) => {
    const { ticketId } = req.params;
    const { userId } = req.body;

    try {
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (ticket.status === 'closed') {
            return res.status(400).json({ error: 'Cannot assign users to a closed ticket' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingAssignment = await TicketAssignment.findOne({
            where: { ticketId, userId },
        });
        if (existingAssignment) {
            return res.status(400).json({ error: 'User already assigned to this ticket' });
        }

        const assignedUsersCount = await TicketAssignment.count({ where: { ticketId } });
        if (assignedUsersCount >= 5) {
            return res.status(400).json({ error: 'Assignment limit reached for this ticket' });
        }

        await TicketAssignment.create({ ticketId, userId });
        res.json({ message: 'User assigned successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// View Analytics for Past Tickets
exports.viewAnalytics = async (req, res) => {
    const { startDate, endDate, status, priority, type, venue } = req.query;

    try {
        // Build query conditions dynamically
        const whereConditions = {};
        if (startDate) whereConditions.createdDate = { [Op.gte]: new Date(startDate) };
        if (endDate) whereConditions.createdDate = { ...whereConditions.createdDate, [Op.lte]: new Date(endDate) };
        if (status) whereConditions.status = status;
        if (priority) whereConditions.priority = priority;
        if (type) whereConditions.type = type;
        if (venue) whereConditions.venue = venue;

        // Fetch all matching tickets
        const tickets = await Ticket.findAll({ where: whereConditions });

        // Analytics calculations
        const totalTickets = tickets.length;
        const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
        const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
        const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress').length;

        const priorityDistribution = {
            low: tickets.filter(ticket => ticket.priority === 'low').length,
            medium: tickets.filter(ticket => ticket.priority === 'medium').length,
            high: tickets.filter(ticket => ticket.priority === 'high').length,
        };

        const typeDistribution = {};
        tickets.forEach(ticket => {
            typeDistribution[ticket.type] = (typeDistribution[ticket.type] || 0) + 1;
        });

        // Response
        res.json({
            totalTickets,
            closedTickets,
            openTickets,
            inProgressTickets,
            priorityDistribution,
            typeDistribution,
            tickets,
        });
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
};