import { Router } from 'express';
import { PacksController } from '../controllers';

const packsRouter = Router();

packsRouter.get('/search', PacksController.getPackByQuery);
packsRouter.get('/all', PacksController.getAllPacks);
packsRouter.get('/details/:id', PacksController.getPackDetails);

export default packsRouter;
