import { Router } from 'express';
import establishmentRouter from './establishment.routes';

const router = Router();

router.use('/establishments', establishmentRouter);

export default router;
