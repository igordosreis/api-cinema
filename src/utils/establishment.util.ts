/* eslint-disable max-lines-per-function */
import { Transaction } from 'sequelize';
import EstablishmentsModel from '../database/models/Establishments.model';
import ProductsService from '../services/Products.service';

export default class EstablishmentUtil {
  public static async setProductsAvailability(establishmentId: number, transaction: Transaction) {
    await this.SetProductByType(establishmentId, 1, transaction);
    await this.SetProductByType(establishmentId, 2, transaction);
  }

  private static async SetProductByType(
    establishmentId: number,
    type: 1 | 2,
    transaction: Transaction,
  ) {
    const allProducts = await ProductsService
      .getProductsByQuery({ establishmentId, type, page: 0, limit: 1000 });

    const isAvailable = allProducts.some((product) => product.available);

    if (type === 1) {
      await EstablishmentsModel.update(
        { availableTickets: isAvailable },
        { 
          where:
          { id: establishmentId },
          transaction,
        },
      );
    }
    if (type === 2) {
      await EstablishmentsModel.update(
        { availableConsumables: isAvailable },
        { 
          where:
          { id: establishmentId },
          transaction,
        },
      );
    }
  }
}