/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { MINIMUM_VOUCHER_QUANTITY } from '../constants';
import {
  IProductFromGetById,
  IProductWithSelectedVouchers,
} from '../interfaces/IProducts';
import CustomError, { vouchersNotEnough, vouchersUnavailable } from './customError.util';

class Orders {
  validateVouchersAmount = (productInfo: IProductFromGetById, amountRequested: number) => {
    const { vouchersAvailable } = productInfo;

    const totalVouchersAvailable = vouchersAvailable.length;
    const areVouchersBelowMinimumQty = totalVouchersAvailable < Number(MINIMUM_VOUCHER_QUANTITY);
    if (areVouchersBelowMinimumQty) throw new CustomError(vouchersNotEnough);

    const areVouchersBelowRequestedQty = Number(MINIMUM_VOUCHER_QUANTITY)
      > totalVouchersAvailable - amountRequested;
    if (areVouchersBelowRequestedQty) throw new CustomError(vouchersUnavailable);
  };

  calculateTotalPriceAndTotalUnits = (productsInfo: IProductWithSelectedVouchers[]) => {
    const totals = productsInfo.reduce(
      (accTotals, currProduct) => {
        // const capitalizedType = currProduct.type.charAt(0).toUpperCase() 
        //   + currProduct.type.slice(1);
        const subTotal = currProduct.price * currProduct.vouchersSelected.length;

        const totalPrice = accTotals.totalPrice + subTotal;
        const totalUnits = accTotals.totalUnits + currProduct.vouchersSelected.length;
        
        console.log('-- - - - - - -- --- -- - - -- ----- -- - -accTotals: ', accTotals);
        return { totalPrice, totalUnits, [`${currProduct.type}s`]: totalUnits };
      },
      { totalPrice: 0, totalUnits: 0 },
    );

    const { totalUnits, ...restOfTotals } = totals;
    
    return restOfTotals;
  };
}

export default new Orders();
