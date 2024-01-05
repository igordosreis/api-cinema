import { Router } from 'express';
import { PlansController } from '../controllers';

const plansRouter = Router();

plansRouter.get('/used', PlansController.getUserTypesPerMonth);
plansRouter.get('/all', PlansController.getAllPlans);
plansRouter.get('/details/:id', PlansController.getPlanById);

export default plansRouter;
