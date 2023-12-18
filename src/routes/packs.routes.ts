import { Router } from 'express';
import { PacksController } from '../controllers';

const packsRouter = Router();

packsRouter.get('/all', PacksController.getAllPacks);

export default packsRouter;
