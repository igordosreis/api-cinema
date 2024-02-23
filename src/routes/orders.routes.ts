import { Router } from 'express';
import { OrdersController } from '../controllers';

const ordersRouter = Router();

ordersRouter.post('/create', OrdersController.createOrder);
ordersRouter.patch('/cancel/:id', OrdersController.cancelOrder);
ordersRouter.get('/all', OrdersController.getAllOrders);
ordersRouter.get('/details/:id', OrdersController.getOrderById);
ordersRouter.get('/verify', OrdersController.verifyOrders);

export default ordersRouter;
