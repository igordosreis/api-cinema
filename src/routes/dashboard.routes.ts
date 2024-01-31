import { Router } from 'express';
import { DashboardController } from '../controllers';

const dashboardRouter = Router();

dashboardRouter.post('/create', DashboardController.createProduct);

export default dashboardRouter;
