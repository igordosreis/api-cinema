import { Request, Response } from 'express';
import { IUserInfoInBody } from '../interfaces/IUser';
import { PlansService } from '../services';

export default class PlansController {
  public static async getUserTypesPerMonth(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id, cinemaPlan },
      },
    } = <IUserInfoInBody>req.body;

    const userTypesPerMonth = await PlansService.getUserTypesPerMonth({
      userId: id,
      cinemaPlan: Number(cinemaPlan),
    });

    res.status(200).json(userTypesPerMonth);
  }

  public static async getAllPlans(_req: Request, res: Response): Promise<void> {
    const allPlans = await PlansService.getAllPlans();

    res.status(200).json(allPlans);
  }

  public static async getPlanById(req: Request, res: Response): Promise<void> {
    const { id: planId } = req.params;

    const parsedPlanId = Number(planId);
    const plan = await PlansService.getPlanById(parsedPlanId);

    res.status(200).json(plan);
  }
}
