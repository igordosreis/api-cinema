import { Router } from 'express';
import { PacksController } from '../controllers';

const packsRouter = Router();

packsRouter.get('/all', PacksController.getAllPacks);
packsRouter.get('/details/:id', PacksController.getPackSummaryById);

export default packsRouter;
