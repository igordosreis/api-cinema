import { Router } from 'express';
import { EstablishmentController } from '../controllers';

const establishmentRouter = Router();

establishmentRouter.get('/', EstablishmentController.getAllEstablishments);
establishmentRouter.get('/cities', EstablishmentController.getAllCities);
establishmentRouter.get('/states', EstablishmentController.getAllStates);

export default establishmentRouter;
