import { Router } from 'express';
import { CartController } from '../controllers';

const cartRouter = Router();

cartRouter.get('/', CartController.getCart);
cartRouter.post('/add', CartController.addToCart);
cartRouter.patch('/remove', CartController.removeFromCart);
cartRouter.delete('/delete', CartController.deleteFromCart);
cartRouter.delete('/deleteAll', CartController.deleteAllCart);

export default cartRouter;
