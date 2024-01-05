import { Router } from 'express';
import { UsersController } from '../controllers';

const ordersRouter = Router();

ordersRouter.post('/create', UsersController.createOrder);
ordersRouter.patch('/details/:id', UsersController.cancelOrder);
ordersRouter.get('/all', UsersController.getAllOrders);
ordersRouter.get('/details/:id', UsersController.getOrderById);

export default ordersRouter;
