import { Router } from 'express';
import { AdminController } from '../controllers';

const adminRouter = Router();

adminRouter.post('/resolve_payment', AdminController.resolvePaymentStatus);

export default adminRouter;
