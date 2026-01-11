"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'STAFF'));
// Dashboard
router.get('/dashboard/stats', admin_controller_1.getDashboardStats);
// Orders
router.get('/orders', admin_controller_1.getAllOrders);
router.put('/orders/:id/status', admin_controller_1.updateOrderStatus);
// Customers
router.get('/customers', admin_controller_1.getCustomers);
// Inventory
router.get('/inventory/low-stock', admin_controller_1.getLowStockProducts);
// Products (Admin CRUD)
router.get('/products', product_controller_1.getProducts);
router.post('/products', product_controller_1.createProduct);
router.put('/products/:id', product_controller_1.updateProduct);
router.delete('/products/:id', (0, auth_1.authorize)('ADMIN'), product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map