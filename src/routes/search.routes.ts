import { Router } from 'express';
import { SearchController } from '../controllers';

const searchRouter = Router();

searchRouter.get('/search', SearchController.productsAndPacksSearch);

export default searchRouter;
