import { Router } from 'express';
import { UsersController } from '../controllers';

const usersRouter = Router();

usersRouter.get('/orders/all', UsersController.getAllOrders);
usersRouter.post('/orders/create', UsersController.createOrder);
usersRouter.get('/orders/details', UsersController.getOrderById);
usersRouter.post('/orders/details', UsersController.cancelOrder);

// PARA TESTE
usersRouter.get('/vouchers_product', UsersController.getVouchersByProductId);

export default usersRouter;
