import { Router } from 'express';
import { OrdersController } from '../controllers';

const ordersRouter = Router();

ordersRouter.post('/create', OrdersController.createOrder);
ordersRouter.patch('/details/:id', OrdersController.cancelOrder);
ordersRouter.get('/all', OrdersController.getAllOrders);
ordersRouter.get('/details/:id', OrdersController.getOrderById);

export default ordersRouter;
