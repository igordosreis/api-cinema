import { Router } from 'express';
import establishmentsRouter from './establishments.routes';
import moviesAPIRouter from './moviesAPI.routes';
import ordersRouter from './orders.routes';
import productsRouter from './products.routes';
import packsRouter from './packs.routes';
import plansRouter from './plans.routes';
import favoritesRouter from './favorites.routes';
import vouchersRouter from './vouchers.routes';
import searchRouter from './search.routes';
import cartRouter from './cart.routes';
import tagsRouter from './tags.routes';

const appRouter = Router();

appRouter.use('/establishments', establishmentsRouter);
appRouter.use('/products', productsRouter);
appRouter.use('/movies', moviesAPIRouter);
appRouter.use('/orders', ordersRouter);
appRouter.use('/packs', packsRouter);
appRouter.use('/plans', plansRouter);
appRouter.use('/favorites', favoritesRouter);
appRouter.use('/vouchers', vouchersRouter);
appRouter.use('/shop', searchRouter);
appRouter.use('/cart', cartRouter);
appRouter.use('/tags', tagsRouter);

export default appRouter;
