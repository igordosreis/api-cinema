import { Request, Response } from 'express';
import { IPlanGetUsedInfoRequest } from '../interfaces/IPlan';
import { PlansService } from '../services';

export default class PlansController {
  public static async getUserTypesPerMonth(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id, cinemaPlan },
      },
    } = <IPlanGetUsedInfoRequest>req.body;

    const userTypesPerMonth = await PlansService.getUserTypesPerMonth({
      userId: id,
      cinemaPlan: Number(cinemaPlan),
    });

    res.status(200).json(userTypesPerMonth);
  }
}
