import CitiesModel from '../database/models/Cities.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import StatesModel from '../database/models/States.model';

export default class EstablishmentService {
  public static async getAllEstablishments(): Promise<EstablishmentsModel[]> {
    const allEstablishments = EstablishmentsModel.findAll();

    return allEstablishments;
  }

  public static async getAllCities() {
    const allCities = CitiesModel.findAll({
      include: [{ model: StatesModel, as: 'state' }],
      attributes: { exclude: ['stateId'] },
    });

    return allCities;
  }

  // public static async getEstablishmentsByAddress() {}
}
