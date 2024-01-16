import { Router } from 'express';
import { CartController } from '../controllers';

const cartRouter = Router();

cartRouter.get('/', CartController.getCart);
// cartRouter.post('/addsingle', CartController.cartAdd);

export default cartRouter;
