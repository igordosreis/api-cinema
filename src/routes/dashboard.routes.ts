import { Router } from 'express';
import { DashboardController } from '../controllers';

const dashboardRouter = Router();

dashboardRouter.post('/create/product', DashboardController.createProduct);
dashboardRouter.post('/create/voucher', DashboardController.createVoucher);
dashboardRouter.post('/create/tag', DashboardController.createTag);
dashboardRouter.post('/get/voucher', DashboardController.getVouchers);

export default dashboardRouter;
