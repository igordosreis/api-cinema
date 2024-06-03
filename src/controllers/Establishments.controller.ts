/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
import { Request, Response } from 'express';
import { EstablishmentsService } from '../services';
import {
  IEstablishmentAddressQueryRawSchema,
  IEstablishmentAddressQuerySchema,
  IEstablishmentAddressRawQuery,
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

    const {
      location: { geolocation, latitude, longitude },
    } = userInfo;
    const { unique } = searchQuery;

    // isAnySearchQueryProvided shouldn't account for pagination; remove pagination from searchQuery
    const isAnySearchQueryProvided = Object.values(searchQuery).some((query) => query);
    if (isAnySearchQueryProvided) {
      const isGeolocationProvided = geolocation && latitude && longitude;
      if (isGeolocationProvided) {
        IEstablishmentAddressQueryRawSchema.parse(searchQuery);

        const formattedQuery = formatRequestQueryUtil.formatEstablishmentQuery({
          searchQuery,
          userInfo,
        });
        IEstablishmentAddressQuerySchema.parse(formattedQuery);
        const establishmentsByAddress = await EstablishmentsService.getEstablishmentsByGeolocQuery(
          formattedQuery,
        );

        res.status(200).json(establishmentsByAddress);
      } else if (unique && unique.toLowerCase() === 'true') {
        const establishmentsByAddress = await EstablishmentsService
          .getEstablishmentHighlights(true);

        res.status(200).json(establishmentsByAddress);
      } else {
        IEstablishmentAddressQueryRawSchema.parse(searchQuery);

        const formattedQuery = formatRequestQueryUtil.formatEstablishmentQuery({
          searchQuery,
          userInfo,
        });
        IEstablishmentAddressQuerySchema.parse(formattedQuery);
        console.log({ formattedQuery });
        const establishmentsByAddress = await EstablishmentsService
          .getEstablishmentAddressByQueryNoGeoloc(
            formattedQuery,
          );
  
        res.status(200).json(establishmentsByAddress);
      }
    } else {
      const establishmentsByAddress = await EstablishmentsService.getEstablishmentHighlights();

      res.status(200).json(establishmentsByAddress);
    }
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

  public static async getEstablishmentOffer(req: Request, res: Response): Promise<void> {
    const searchQuery: IEstablishmentAddressRawQuery = {  
      limit: '10',
      page: '0',
    };
    const { userInfo } = <IUserInfoInBody>req.body;
    const {
      location: { geolocation },
    } = userInfo;

    IEstablishmentAddressQueryRawSchema.parse(searchQuery);

    const formattedQuery = formatRequestQueryUtil.formatEstablishmentQuery({
      searchQuery,
      userInfo,
    });
    IEstablishmentAddressQuerySchema.parse(formattedQuery);

    const establishmentOffer = await EstablishmentsService
      .getEstablishmentOffer(formattedQuery, geolocation);

    res.status(200).json(establishmentOffer);
  }
}
