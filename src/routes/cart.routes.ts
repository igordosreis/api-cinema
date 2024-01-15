import { Router } from 'express';
import { CartController } from '../controllers';

const cartRouter = Router();

cartRouter.get('/', CartController.getCart);

export default cartRouter;
