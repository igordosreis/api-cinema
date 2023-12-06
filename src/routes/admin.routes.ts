import { Router } from 'express';
import { AdminController } from '../controllers';

const adminRouter = Router();

adminRouter.get('/resolve_payment', AdminController.resolvePaymentStatus);

export default adminRouter;
