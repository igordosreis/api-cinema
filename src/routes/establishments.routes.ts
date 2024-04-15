import { Router } from 'express';
import { EstablishmentsController } from '../controllers';

const establishmentsRouter = Router();

establishmentsRouter.get('/brands', EstablishmentsController.getAllEstablishments);
establishmentsRouter.get('/brands/:id', EstablishmentsController.getEstablishmentById);
establishmentsRouter.get('/search', EstablishmentsController.getEstablishmentsByAddress);
establishmentsRouter.get('/cities', EstablishmentsController.getAllCities);
establishmentsRouter.get('/states', EstablishmentsController.getAllStates);
establishmentsRouter.get('/offer', EstablishmentsController.getEstablishmentOffer);

export default establishmentsRouter;
