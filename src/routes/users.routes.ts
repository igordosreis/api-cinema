import { Router } from 'express';
import { UsersController } from '../controllers';

const usersRouter = Router();

usersRouter.get('/orders/all', UsersController.getAllOrders);
usersRouter.get('/vouchers_product', UsersController.getVouchersByProductId);
usersRouter.post('/create_order', UsersController.createOrder);
usersRouter.get('/orders', UsersController.getOrderById);

export default usersRouter;
