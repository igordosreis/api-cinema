import { Router } from 'express';
import { UsersController } from '../controllers';

const usersRouter = Router();

usersRouter.post('/orders/create', UsersController.createOrder);
usersRouter.patch('/orders/details/:id', UsersController.cancelOrder);
usersRouter.get('/orders/all', UsersController.getAllOrders);
usersRouter.get('/orders/details/:id', UsersController.getOrderById);

export default usersRouter;
