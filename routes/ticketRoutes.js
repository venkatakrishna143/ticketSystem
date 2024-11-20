const express = require('express');
const ticket = require('../controllers/ticketController');

const router = express.Router();

// CRUD operations for Tickets
router.post('/createTicket',ticket.createTicket);
router.get('/getTickets', ticket.getTickets);
router.get('/getTicket/:id', ticket.getTicket);
router.put('updateTicket/:id', ticket.updateTicket);
router.delete('/deleteTicket/:id', ticket.deleteTicket);
router.delete('/assignTicket', ticket.assignUserToTicket);
router.delete('/analysis', ticket.viewAnalytics);

module.exports = router;