import { Router } from 'express';
import { DashboardController } from '../controllers';

const dashboardRouter = Router();

dashboardRouter.patch('/establishment/edit', DashboardController.editEstablishment);
dashboardRouter.post('/product/create', DashboardController.createProduct);
dashboardRouter.patch('/product/edit', DashboardController.editProduct);
dashboardRouter.post('/pack/create', DashboardController.createPack);
dashboardRouter.patch('/pack/edit', DashboardController.editPack);
dashboardRouter.post('/voucher/create', DashboardController.createVoucher);
dashboardRouter.get('/voucher/get', DashboardController.getVouchers);
dashboardRouter.put('/voucher/withdraw/single', DashboardController.withdrawSingleVoucher);
dashboardRouter.post('/tag/create', DashboardController.createTag);

export default dashboardRouter;
