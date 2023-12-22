import { Router } from 'express';
import { PacksController } from '../controllers';

const packsRouter = Router();

packsRouter.get('/search', PacksController.getPackByQuery);
packsRouter.get('/all', PacksController.getAllPacks);
packsRouter.get('/details/:id', PacksController.getPackSummaryById);

export default packsRouter;
