import { Router } from 'express';
import { VouchersController } from '../controllers';

const vouchersRouter = Router();

vouchersRouter.get('/all', VouchersController.getAllVouchersUserByDate);

export default vouchersRouter;
