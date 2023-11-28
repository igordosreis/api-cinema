import { Request, Response } from 'express';
import { EstablishmentsService } from '../services';
import { IEstablishmentRawQuery } from '../interfaces/IEstablishments';
import { IProductRawQuery } from '../interfaces/IProducts';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';

export default class EstablishmentsController {
  public static async getAllEstablishments(_req: Request, res: Response): Promise<void> {
    const allEstablishments = await EstablishmentsService.getAllEstablishments();

    res.status(200).json(allEstablishments);
  }

  public static async getEstablishmentsByAddress(req: Request, res: Response): Promise<void> {
    const searchQuery = req as IEstablishmentRawQuery;

    const formattedQuery = formatRequestQueryUtil.formatEstablishmentQuery(searchQuery);
    const establishmentsByAddress = await EstablishmentsService.getEstablishmentsByAddress(
      formattedQuery,
    );

    res.status(200).json(establishmentsByAddress);
  }

  public static async getAllCities(_req: Request, res: Response): Promise<void> {
    const allCities = await EstablishmentsService.getAllCities();

    res.status(200).json(allCities);
  }

  public static async getAllStates(_req: Request, res: Response): Promise<void> {
    const allStates = await EstablishmentsService.getAllStates();

    res.status(200).json(allStates);
  }

  public static async getProductsByQuery(req: Request, res: Response): Promise<void> {
    const searchQuery = req as IProductRawQuery;

    const formattedQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
    const filteredProducts = await EstablishmentsService.getProductsByQuery(formattedQuery);

    res.status(200).json(filteredProducts);
  }
}
