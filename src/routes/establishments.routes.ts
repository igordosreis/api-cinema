import { Router } from 'express';
import { EstablishmentsController } from '../controllers';

const establishmentRouter = Router();

establishmentRouter.get('/brands', EstablishmentsController.getAllEstablishments);
establishmentRouter.get('/search', EstablishmentsController.getEstablishmentsByAddress);
establishmentRouter.get('/cities', EstablishmentsController.getAllCities);
establishmentRouter.get('/states', EstablishmentsController.getAllStates);
establishmentRouter.get('/products', EstablishmentsController.getProductsByQuery);

export default establishmentRouter;
