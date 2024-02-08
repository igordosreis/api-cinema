import { Router } from 'express';
import { DashboardController } from '../controllers';

const dashboardRouter = Router();

dashboardRouter.post('/create/product', DashboardController.createProduct);
dashboardRouter.post('/create/pack', DashboardController.createPack);
dashboardRouter.post('/create/voucher', DashboardController.createVoucher);
dashboardRouter.post('/create/tag', DashboardController.createTag);
dashboardRouter.get('/get/voucher', DashboardController.getVouchers);
dashboardRouter.put('/voucher/withdraw/single', DashboardController.withdrawSingleVoucher);

export default dashboardRouter;
