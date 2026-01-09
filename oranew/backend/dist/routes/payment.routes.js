"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/create', auth_1.protect, payment_controller_1.createPayment);
router.post('/verify', auth_1.protect, payment_controller_1.verifyPayment);
router.post('/webhook', payment_controller_1.webhook);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map