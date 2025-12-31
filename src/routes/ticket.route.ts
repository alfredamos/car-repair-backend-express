import express from 'express';
import {ticketMiddleware} from '../middlewares/ticketMiddleware.middleware';
import {TicketController} from "../controllers/ticket.controller";
import {adminAuthorizationMiddleware} from "../middlewares/adminAuthorizationMiddleware.middleware";
import {idCheckMiddleware} from "../middlewares/idCheckMiddleware.middleware";
import {sameUserEmailOrAdminMiddleware} from "../middlewares/sameUserEmailOrAdminMiddleware.middleware";

export const router = express.Router();

router.param("id", idCheckMiddleware);

router.route('/')
    .get(adminAuthorizationMiddleware, TicketController.getAllTickets)
    .post(adminAuthorizationMiddleware, ticketMiddleware, TicketController.createTicket);

router.route('/:id')
    .get(TicketController.getTicketById)
    .delete(adminAuthorizationMiddleware, TicketController.deleteTicketById)
    .patch(adminAuthorizationMiddleware, TicketController.editTicketById);

router.route('/change-status/:id')
    .patch(TicketController.changeTicketStatus);

router.route('/get-tickets-by-customer-id/:customerId')
    .get(adminAuthorizationMiddleware, TicketController.getTicketsByCustomerId);

router.route('/all/get-all-complete-tickets')
    .get(adminAuthorizationMiddleware, TicketController.getCompletedTickets);

router.route('/all/get-all-incomplete-tickets')
    .get(adminAuthorizationMiddleware, TicketController.getIncompleteTickets);

router.route('/get-tickets-by-user-email/:email')
.get(sameUserEmailOrAdminMiddleware, TicketController.getTicketsByUserEmail);

export default router;
