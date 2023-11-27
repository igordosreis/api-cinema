import { Request, Response } from 'express';
import { EstablishmentService } from '../services';
import { IEstablishmentRawQuery } from '../interfaces/IEstablishments';
import { IProductRawQuery } from '../interfaces/IProducts';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';

export default class EstablishmentController {
  public static async getAllEstablishments(_req: Request, res: Response): Promise<void> {
    const allEstablishments = await EstablishmentService.getAllEstablishments();

    res.status(200).json(allEstablishments);
  }

  public static async getEstablishmentsByAddress(req: Request, res: Response): Promise<void> {
    const searchQuery = req as IEstablishmentRawQuery;

    const formattedQuery = formatRequestQueryUtil.formatEstablishmentQuery(searchQuery);
    const establishmentsByAddress = await EstablishmentService.getEstablishmentsByAddress(
      formattedQuery,
    );

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

  public static async getAllProducts(req: Request, res: Response): Promise<void> {
    const searchQuery = req as IProductRawQuery;

    const formattedQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
    const allProducts = await EstablishmentService.getAllProducts(formattedQuery);

    res.status(200).json(allProducts);
  }
}
