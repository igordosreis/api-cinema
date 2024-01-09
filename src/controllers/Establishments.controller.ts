import { Request, Response } from 'express';
import { EstablishmentsService } from '../services';
import { 
  IEstablishmentAddressQuerySchema,
  IEstablishmentAddressRawQuery,
} from '../interfaces/IEstablishments';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { IUserInfo } from '../interfaces/IUser';

export default class EstablishmentsController {
  public static async getAllEstablishments(_req: Request, res: Response): Promise<void> {
    const allEstablishments = await EstablishmentsService.getAllEstablishments();

    res.status(200).json(allEstablishments);
  }

  public static async getEstablishmentsByAddress(req: Request, res: Response): Promise<void> {
    const searchQuery = <IEstablishmentAddressRawQuery>req.params;
    const userInfo = <IUserInfo>req.body;

    const formattedQuery = formatRequestQueryUtil.formatEstablishmentQuery({
      searchQuery,
      userInfo,
    });
    IEstablishmentAddressQuerySchema.parse(formattedQuery);
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
}
