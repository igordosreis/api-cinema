import { Router } from 'express';
import { DashboardController } from '../controllers';
import VoucherExcelUploadMiddleware from '../middlewares/VoucherExcelUpload.middleware';
import ImageUploadMiddleware from '../middlewares/ImageUpload.middleware';

const dashboardRouter = Router();

// Establishment
dashboardRouter.get('/establishment/brand/get', DashboardController.getEstablishmentBrands);
dashboardRouter.get('/establishment/brand/get/:id', DashboardController.getEstablishmentBrandById);
dashboardRouter.get('/establishment/address/get', DashboardController.getEstablishmentAddress);
dashboardRouter.patch('/establishment/brand/edit', DashboardController.editEstablishmentBrand);
dashboardRouter.put(
  '/establishment/image/edit',
  ImageUploadMiddleware,
  DashboardController.editEstablishmentImage,
);

// Shop -- Product & Pack
dashboardRouter.get('/shop/get', DashboardController.productsAndPacksGet);
dashboardRouter.get('/shop/product/get/:id', DashboardController.getProductById);
dashboardRouter.post('/shop/product/create', DashboardController.createProduct);
dashboardRouter.patch('/shop/product/edit', DashboardController.editProduct);
dashboardRouter.get('/shop/pack/get/:id', DashboardController.getPackById);
dashboardRouter.post('/shop/pack/create', DashboardController.createPack);
dashboardRouter.patch('/shop/pack/edit', DashboardController.editPack);

// Voucher
dashboardRouter.post(
  '/voucher/create',
  VoucherExcelUploadMiddleware,
  DashboardController.createVoucher,
);
dashboardRouter.get('/voucher/get', DashboardController.getVouchers);
dashboardRouter.get('/voucher/types', DashboardController.getVoucherTypes);
dashboardRouter.put('/voucher/withdraw/single', DashboardController.withdrawSingleVoucher);

// Tag
dashboardRouter.post('/tag/create', DashboardController.createTag);

// Comment
dashboardRouter.get('/comment/actions/get', DashboardController.getAllCommentActions);

export default dashboardRouter;
