import { Request, Response } from 'express';
import { EstablishmentService } from '../services';

export default class EstablishmentController {
  public static async getAllEstablishments(_req: Request, res: Response): Promise<void> {
    const allEstablishments = EstablishmentService.getAllEstablishments();

    res.status(200).json(allEstablishments);
  }
}
