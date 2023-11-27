import { Router } from 'express';
import { EstablishmentController } from '../controllers';

const establishmentRouter = Router();

establishmentRouter.get('/brands', EstablishmentController.getAllEstablishments);
establishmentRouter.get('/search', EstablishmentController.getEstablishmentsByAddress);
establishmentRouter.get('/cities', EstablishmentController.getAllCities);
establishmentRouter.get('/states', EstablishmentController.getAllStates);
establishmentRouter.get('/products', EstablishmentController.getProductsByQuery);

export default establishmentRouter;
