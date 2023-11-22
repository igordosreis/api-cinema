import { Request, Response } from 'express';
import { EstablishmentService } from '../services';

export default class EstablishmentController {
  public static async getAllEstablishments(_req: Request, res: Response): Promise<void> {
    const allEstablishments = await EstablishmentService.getAllEstablishments();

    res.status(200).json(allEstablishments);
  }

  public static async getAllCities(_req: Request, res: Response): Promise<void> {
    const allCities = await EstablishmentService.getAllCities();

    res.status(200).json(allCities);
  }

  public static async getAllStates(_req: Request, res: Response): Promise<void> {
    const allStates = await 'placeholder';

    res.status(200).json(allStates);
  }
}
