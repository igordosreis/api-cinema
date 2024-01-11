import { Router } from 'express';
import { SearchController } from '../controllers';

const searchRouter = Router();

searchRouter.patch('/', SearchController.productsAndPacksSearch);

export default searchRouter;
