import { Request, Response } from 'express';
import { EstablishmentsService } from '../services';
import { 
  IEstablishmentAddressQueryRawSchema,
  IEstablishmentAddressQuerySchema,
  IEstablishmentAddressRawQuery,
  IEstablishmentBrandEditInBody,
  IEstablishmentBrandEditSchema,
} from '../interfaces/IEstablishments';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { IUserInfoInBody } from '../interfaces/IUser';

export default class EstablishmentsController {
  public static async getAllEstablishments(_req: Request, res: Response): Promise<void> {
    const allEstablishments = await EstablishmentsService.getAllEstablishments();

    res.status(200).json(allEstablishments);
  }

  public static async getEstablishmentsByAddress(req: Request, res: Response): Promise<void> {
    const searchQuery = <IEstablishmentAddressRawQuery>req.query;
    const { userInfo } = <IUserInfoInBody>req.body;

    IEstablishmentAddressQueryRawSchema.parse(searchQuery);
    
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

  public static async getEstablishmentById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { userInfo } = <IUserInfoInBody>req.body;

    const establishmentId = Number(id);
    const latitude = userInfo.location?.latitude || '-19.919052';
    const longitude = userInfo.location?.longitude || '-43.9386685';

    const establishment = await EstablishmentsService.getEstablishmentById({
      establishmentId,
      latitude,
      longitude,
    });

    res.status(200).json(establishment);
  }

  public static async editEstablishment(req: Request, res: Response): Promise<void> {
    const { establishmentInfo } = <IEstablishmentBrandEditInBody>req.body;

    const parsedEditInfo = IEstablishmentBrandEditSchema.parse(establishmentInfo);
    await EstablishmentsService.editEstablishment(parsedEditInfo);

    res.status(200).end();
  }
}
