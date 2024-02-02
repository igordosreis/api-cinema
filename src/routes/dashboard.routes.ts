import { Router } from 'express';
import { ProductsController, TagsController, VouchersController } from '../controllers';

const dashboardRouter = Router();

dashboardRouter.post('/create/product', ProductsController.createProduct);
dashboardRouter.post('/create/voucher', VouchersController.createVoucher);
dashboardRouter.post('/create/tag', TagsController.createTag);

export default dashboardRouter;
