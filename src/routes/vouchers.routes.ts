import { Router } from 'express';
import { VouchersController } from '../controllers';
import VoucherExcelUploadMiddleware from '../middlewares/VoucherExcelUpload.middleware';

const vouchersRouter = Router();

vouchersRouter.get('/all', VouchersController.getAllVouchersUserByDate);
vouchersRouter.post('/create', VoucherExcelUploadMiddleware, VouchersController.createVouchers);

export default vouchersRouter;
