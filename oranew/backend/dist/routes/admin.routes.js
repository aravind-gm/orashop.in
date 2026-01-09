"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'STAFF'));
router.get('/dashboard/stats', admin_controller_1.getDashboardStats);
router.get('/orders', admin_controller_1.getAllOrders);
router.put('/orders/:id/status', admin_controller_1.updateOrderStatus);
router.get('/customers', admin_controller_1.getCustomers);
router.get('/inventory/low-stock', admin_controller_1.getLowStockProducts);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map