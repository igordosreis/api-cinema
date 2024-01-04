import { Router } from 'express';
import { PlansController } from '../controllers';

const plansRouter = Router();

plansRouter.patch('/used', PlansController.getUserTypesPerMonth);

export default plansRouter;
