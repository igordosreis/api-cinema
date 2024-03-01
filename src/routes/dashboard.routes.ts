import { Router } from 'express';
import { DashboardController } from '../controllers';
import VoucherExcelUploadMiddleware from '../middlewares/VoucherExcelUpload.middleware';
import ImageUploadMiddleware from '../middlewares/ImageUpload.middleware';

const dashboardRouter = Router();

dashboardRouter.get('/establishment/brands/get', DashboardController.getEstablishmentBrands);
dashboardRouter.get('/establishment/address/get', DashboardController.getEstablishmentAddress);
dashboardRouter.patch('/establishment/brand/edit', DashboardController.editEstablishmentBrand);
dashboardRouter.put(
  '/establishment/image/edit',
  ImageUploadMiddleware,
  DashboardController.editEstablishmentImage,
);

dashboardRouter.get('/shop/get', DashboardController.productsAndPacksGet);
dashboardRouter.post('/shop/product/create', DashboardController.createProduct);
dashboardRouter.patch('/shop/product/edit', DashboardController.editProduct);
dashboardRouter.post('/shop/pack/create', DashboardController.createPack);
dashboardRouter.patch('/shop/pack/edit', DashboardController.editPack);

dashboardRouter.post(
  '/voucher/create',
  VoucherExcelUploadMiddleware,
  DashboardController.createVoucher,
);
dashboardRouter.get('/voucher/get', DashboardController.getVouchers);
dashboardRouter.put('/voucher/withdraw/single', DashboardController.withdrawSingleVoucher);

dashboardRouter.post('/tag/create', DashboardController.createTag);

export default dashboardRouter;
