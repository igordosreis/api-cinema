import { Router } from 'express';
import { EstablishmentsController } from '../controllers';

const establishmentsRouter = Router();

establishmentsRouter.get('/brands', EstablishmentsController.getAllEstablishments);
establishmentsRouter.get('/search', EstablishmentsController.getEstablishmentsByAddress);
establishmentsRouter.get('/cities', EstablishmentsController.getAllCities);
establishmentsRouter.get('/states', EstablishmentsController.getAllStates);
establishmentsRouter.get('/products', EstablishmentsController.getProductsByQuery);
establishmentsRouter.get('/products/types', EstablishmentsController.getProductsTypes);

export default establishmentsRouter;
