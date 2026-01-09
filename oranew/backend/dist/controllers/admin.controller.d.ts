import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getDashboardStats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllOrders: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOrderStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCustomers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getLowStockProducts: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map