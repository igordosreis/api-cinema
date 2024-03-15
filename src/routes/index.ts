import { Router } from 'express';
import adminRouter from './admin.routes';
import dashboardRouter from './dashboard.routes';
import appRouter from './app.routes';
import appAuthMiddleware from '../middlewares/appAuth.middleware';
import dashboardAuthMiddleware from '../middlewares/dashboardAuth.middleware';
import adminAuthMiddleware from '../middlewares/adminAuth.middleware';
import commentsMiddleware from '../middlewares/comments.middleware';

const router = Router();

router.use('/app', appAuthMiddleware, appRouter);
router.use('/admin', adminAuthMiddleware, adminRouter);
router.use('/dashboard', dashboardAuthMiddleware, commentsMiddleware, dashboardRouter);

export default router;
