import { Router } from 'express';
import establishmentsRouter from './establishments.routes';
import moviesAPIRouter from './moviesAPI.routes';
import ordersRouter from './orders.routes';
import adminRouter from './admin.routes';
import productsRouter from './products.routes';
import packsRouter from './packs.routes';
import plansRouter from './plans.routes';

const router = Router();

router.use('/establishments', establishmentsRouter);
router.use('/products', productsRouter);
router.use('/movies', moviesAPIRouter);
router.use('/orders', ordersRouter);
router.use('/admin', adminRouter);
router.use('/packs', packsRouter);
router.use('/plans', plansRouter);

export default router;
