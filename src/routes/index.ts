import { Router } from 'express';
import adminRouter from './admin.routes';
import dashboardRouter from './dashboard.routes';
import appRouter from './app.routes';
import appAuthMiddleware from '../middlewares/appAuth.middleware';
import dashboardAuthMiddleware from '../middlewares/dashboardAuth.middleware';

const router = Router();

router.use('/app', appAuthMiddleware, appRouter);
router.use('/admin', adminRouter);
router.use('/dashboard', dashboardAuthMiddleware, dashboardRouter);

export default router;
