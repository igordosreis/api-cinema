import { Router } from 'express';
import establishmentRouter from './establishment.routes';

const router = Router();

router.use('/establishment', establishmentRouter);

export default router;
