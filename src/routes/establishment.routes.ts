import { Router } from 'express';
import { EstablishmentController } from '../controllers';

const establishmentRouter = Router();

establishmentRouter.get('/', EstablishmentController.getAllEstablishments);

export default establishmentRouter;
