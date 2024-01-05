import { Router } from 'express';
import { FavoritesController } from '../controllers';

const favoritesRouter = Router();

favoritesRouter.put('/toggle/:id', FavoritesController.toggleFavoriteEstablishment);
favoritesRouter.get('/all', FavoritesController.getAllUserFavoriteAddresses);

export default favoritesRouter;
