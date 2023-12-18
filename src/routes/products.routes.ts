import { Router } from 'express';
import { ProductsController } from '../controllers';

const productsRouter = Router();

productsRouter.get('/all', ProductsController.getProductsByQuery);
productsRouter.get('/types', ProductsController.getProductsTypes);

export default productsRouter;
