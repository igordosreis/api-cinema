import { Router } from 'express';
import { EstablishmentController } from '../controllers';
import authMiddleware from '../middlewares/auth.middleware';

const establishmentRouter = Router();

establishmentRouter.get('/brands', authMiddleware, EstablishmentController.getAllEstablishments);
establishmentRouter.get(
  '/search',
  authMiddleware,
  EstablishmentController.getEstablishmentsByAddress,
);
establishmentRouter.get('/cities', authMiddleware, EstablishmentController.getAllCities);
establishmentRouter.get('/states', authMiddleware, EstablishmentController.getAllStates);
establishmentRouter.get('/products', authMiddleware, EstablishmentController.getProductsByQuery);

export default establishmentRouter;
