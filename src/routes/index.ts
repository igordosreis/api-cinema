import { Router } from 'express';
import establishmentsRouter from './establishments.routes';
import moviesAPIRouter from './moviesAPI.routes';
import usersRouter from './users.routes';

const router = Router();

router.use('/establishments', establishmentsRouter);
router.use('/movies', moviesAPIRouter);
router.use('/user', usersRouter);

export default router;
