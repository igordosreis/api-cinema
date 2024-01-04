import { Router } from 'express';
import { PlansController } from '../controllers';

const plansRouter = Router();

plansRouter.get('/used', PlansController.getUserTypesPerMonth);

export default plansRouter;
