import { Router } from 'express';
import { FavoritesController } from '../controllers';

const favoritesRouter = Router();

favoritesRouter.put('/toggle', FavoritesController.toggleFavoriteEstablishment);

export default favoritesRouter;
