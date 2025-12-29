import express from "express";
import {CustomerController} from "../controllers/customer.controller";
import {customerMiddleware} from "../middlewares/customerMiddleware.middleware";
import {adminAuthorizationMiddleware} from "../middlewares/adminAuthorizationMiddleware.middleware";
import {sameUserOrAdminMiddleware} from "../middlewares/sameUserOrAdminMiddleware.middleware";

const router = express.Router();

router.route("/")
    .post(adminAuthorizationMiddleware, customerMiddleware, CustomerController.createCustomer)
    .get(adminAuthorizationMiddleware, CustomerController.getAllCustomers);

router.route("/:id")
    .delete(adminAuthorizationMiddleware, CustomerController.deleteCustomerById)
    .get(CustomerController.getCustomerById)
    .patch(adminAuthorizationMiddleware, CustomerController.editCustomerById);

router.route("/all-active/get-all-active-customers")
    .get(adminAuthorizationMiddleware, CustomerController.getActiveCustomers);

router.route("/all-inactive/get-all-inactive-customers")
    .get(adminAuthorizationMiddleware, CustomerController.getInactiveCustomers);

router.route("/activate-customer/:id")
    .patch(adminAuthorizationMiddleware, CustomerController.changeCustomerStatus);

export default router;