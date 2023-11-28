import { Router } from 'express';
import { UsersController } from '../controllers';

const usersRouter = Router();

usersRouter.get('/history', UsersController.getUserVoucherHistory);

export default usersRouter;
