import { Router } from 'express';
import { UsersController } from '../controllers';

const usersRouter = Router();

usersRouter.get('/history', UsersController.getUserVoucherHistory);
usersRouter.get('/vouchers_product', UsersController.getVouchersByProductId);
usersRouter.get('/reserve_vouchers', UsersController.createOrder);

export default usersRouter;
