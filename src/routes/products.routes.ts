import { Router } from 'express';
import { EstablishmentsController } from '../controllers';

const productsRouter = Router();

productsRouter.get('/all', EstablishmentsController.getProductsByQuery);
productsRouter.get('/types', EstablishmentsController.getProductsTypes);

export default productsRouter;
