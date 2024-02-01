import { Router } from 'express';
import { DashboardController } from '../controllers';

const dashboardRouter = Router();

dashboardRouter.post('/product/create', DashboardController.createProduct);
dashboardRouter.post('/voucher/create', DashboardController.createVoucher);
dashboardRouter.post('/tag/create', DashboardController.createTag);

export default dashboardRouter;
