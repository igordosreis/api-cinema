import { Router } from 'express';
import { ProductsController } from '../controllers';

const productsRouter = Router();

productsRouter.get('/search', ProductsController.getProductsByQuery);
productsRouter.get('/types', ProductsController.getProductsTypes);
productsRouter.get('/details/:id', ProductsController.getProductDetails);

export default productsRouter;
