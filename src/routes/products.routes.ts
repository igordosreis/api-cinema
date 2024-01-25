import { Router } from 'express';
import { ProductsController } from '../controllers';

const productsRouter = Router();

productsRouter.get('/search', ProductsController.getProductsByQuery);
productsRouter.get('/types', ProductsController.getProductsTypes);
productsRouter.post('/create', ProductsController.createProduct);

export default productsRouter;
