import { Request, Response } from 'express';
import { EstablishmentService } from '../services';
import { IEstablishmentRawQuery } from '../interfaces/IEstablishments';
import formatQueryRequestUtil from '../utils/formatQueryRequest.util';

export default class EstablishmentController {
  public static async getAllEstablishments(_req: Request, res: Response): Promise<void> {
    const allEstablishments = await EstablishmentService.getAllEstablishments();

    res.status(200).json(allEstablishments);
  }

  public static async getEstablishmentsByAddress(
    req: Request,
    res: Response,
  ): Promise<void> {
    const searchQuery = req as IEstablishmentRawQuery;
    // const { page, limit, distance, latitude, longitude, cityId, stateId } = searchQuery;
    const formattedQuery = formatQueryRequestUtil.formatQuery(searchQuery);
    console.log('formattedQuery: ', formattedQuery);
    
    const establishmentsByAddress = await EstablishmentService
      .getEstablishmentsByAddress(formattedQuery);

    res.status(200).json(establishmentsByAddress);
  }

  public static async getAllCities(_req: Request, res: Response): Promise<void> {
    const allCities = await EstablishmentService.getAllCities();

    res.status(200).json(allCities);
  }

  public static async getAllStates(_req: Request, res: Response): Promise<void> {
    const allStates = await EstablishmentService.getAllStates();

    res.status(200).json(allStates);
  }
}
