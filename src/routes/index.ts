import { Router } from 'express';
import establishmentsRouter from './establishments.routes';
import moviesAPIRouter from './moviesAPI.routes';

const router = Router();

router.use('/establishments', establishmentsRouter);
router.use('/movies', moviesAPIRouter);

export default router;
