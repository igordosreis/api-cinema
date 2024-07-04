/* eslint-disable max-lines-per-function */
import EstablishmentsModel from '../database/models/Establishments.model';
import { ProductsService } from '../services';

export default class EstablishmentUtil {
  public static async setProductsAvailability(establishmentId: number) {
    await this.SetProductByType(establishmentId, 1);
    await this.SetProductByType(establishmentId, 2);
  }

  private static async SetProductByType(establishmentId: number, type: 1 | 2) {
    const allProducts = await ProductsService
      .getProductsByQuery({ establishmentId, type, page: 1, limit: 1000 });

    const isAvailable = allProducts.some((product) => product.available);

    if (type === 1) {
      await EstablishmentsModel.update(
        { availableTickets: isAvailable },
        { where:
          { id: establishmentId },
        },
      );
    }
    if (type === 2) {
      await EstablishmentsModel.update(
        { availableConsumables: isAvailable },
        { where:
          { id: establishmentId },
        },
      );
    }
  }
}