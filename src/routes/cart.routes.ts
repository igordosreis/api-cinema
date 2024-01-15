import { Router } from 'express';
import { CartController } from '../controllers';

const cartRouter = Router();

cartRouter.patch('/', CartController.getCart);

export default cartRouter;
