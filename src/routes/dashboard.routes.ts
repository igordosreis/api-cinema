import { Router } from 'express';
import { DashboardController } from '../controllers';
import VoucherExcelUploadMiddleware from '../middlewares/VoucherExcelUpload.middleware';
import ImageUploadMiddleware from '../middlewares/ImageUpload.middleware';

const dashboardRouter = Router();

dashboardRouter.get('/establishment/get', DashboardController.getEstablishmentAddress);
dashboardRouter.patch('/establishment/edit', DashboardController.editEstablishment);
dashboardRouter.put(
  '/establishment/image/edit', 
  ImageUploadMiddleware,
  DashboardController.editEstablishmentImage,
);
dashboardRouter.post('/product/create', DashboardController.createProduct);
dashboardRouter.patch('/product/edit', DashboardController.editProduct);
dashboardRouter.post('/pack/create', DashboardController.createPack);
dashboardRouter.patch('/pack/edit', DashboardController.editPack);
dashboardRouter.post(
  '/voucher/create',
  VoucherExcelUploadMiddleware,
  DashboardController.createVoucher,
);
dashboardRouter.get('/voucher/get', DashboardController.getVouchers);
dashboardRouter.put('/voucher/withdraw/single', DashboardController.withdrawSingleVoucher);
dashboardRouter.post('/tag/create', DashboardController.createTag);

export default dashboardRouter;
