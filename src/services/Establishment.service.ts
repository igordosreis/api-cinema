import EstablishmentsModel from '../database/models/Establishments.model';

export default class EstablishmentService {
  public static async getAllEstablishments(): Promise<EstablishmentsModel[]> {
    const allEstablishments = EstablishmentsModel.findAll();

    return allEstablishments;
  }
}
