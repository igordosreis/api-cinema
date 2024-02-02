import { Router } from 'express';
import { EstablishmentsController } from '../controllers';

const establishmentsRouter = Router();

establishmentsRouter.get('/brands', EstablishmentsController.getAllEstablishments);
establishmentsRouter.get('/search', EstablishmentsController.getEstablishmentsByAddress);
establishmentsRouter.get('/cities', EstablishmentsController.getAllCities);
establishmentsRouter.get('/states', EstablishmentsController.getAllStates);
establishmentsRouter.get('/:id', EstablishmentsController.getEstablishmentById);

export default establishmentsRouter;
