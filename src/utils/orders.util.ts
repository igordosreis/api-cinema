/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { MINIMUM_VOUCHER_QUANTITY } from '../constants';
import { IProductWithVouchers } from '../interfaces/IProducts';
import { UpdateVouchersParams } from '../interfaces/IVouchers';
import CustomError, { vouchersNotEnough, vouchersUnavailable } from './customError.util';

class Orders {
  validateVouchersAmount = (
    productInfo: IProductWithVouchers,
    updateVoucherParams: UpdateVouchersParams,
  ) => {
    const { vouchersAvailable } = productInfo;
    const { amountRequested } = updateVoucherParams;

    const totalVouchersAvailable = vouchersAvailable.length;
    const areVouchersBelowMinimumQty = totalVouchersAvailable < Number(MINIMUM_VOUCHER_QUANTITY);
    if (areVouchersBelowMinimumQty) throw new CustomError(vouchersNotEnough);

    const areVouchersBelowRequestedQty = (Number(MINIMUM_VOUCHER_QUANTITY) 
      > totalVouchersAvailable - amountRequested);
    if (areVouchersBelowRequestedQty) throw new CustomError(vouchersUnavailable);
  };
}

export default new Orders();
