import { Router } from 'express';
import establishmentsRouter from './establishments.routes';
import moviesAPIRouter from './moviesAPI.routes';
import usersRouter from './users.routes';
import adminRouter from './admin.routes';
import productsRouter from './products.routes';

const router = Router();

router.use('/establishments', establishmentsRouter);
router.use('/products', productsRouter);
router.use('/movies', moviesAPIRouter);
router.use('/user', usersRouter);
router.use('/admin', adminRouter);

export default router;
