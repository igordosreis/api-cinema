import { Router } from 'express';
import { UsersController } from '../controllers';

const usersRouter = Router();

usersRouter.get('/history', UsersController.getUserVoucherHistory);
usersRouter.get('/vouchers_product', UsersController.getVouchersByProductId);
usersRouter.post('/create_order', UsersController.createOrder);

export default usersRouter;
