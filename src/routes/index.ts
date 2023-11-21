import { Router } from 'express';
import establishmentRouter from './establishment.routes';
import moviesAPIRouter from './moviesAPI.routes';

const router = Router();

router.use('/establishments', establishmentRouter);
router.use('/movies', moviesAPIRouter);

export default router;
