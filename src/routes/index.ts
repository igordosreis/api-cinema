import { Router } from 'express';
import adminRouter from './admin.routes';
import dashboardRouter from './dashboard.routes';
import appRouter from './app.routes';
import appAuthMiddleware from '../middlewares/appAuth.middleware';

const router = Router();

router.use('/app', appAuthMiddleware, appRouter);
router.use('/admin', adminRouter);
router.use('/dashboard', appAuthMiddleware, dashboardRouter);

export default router;
