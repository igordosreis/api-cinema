/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { MINIMUM_VOUCHER_QUANTITY } from '../constants';
import { IProductWithVouchers } from '../interfaces/IProducts';
import { UpdateVouchersParams } from '../interfaces/IVouchers';
import CustomError, { vouchersNotEnough, vouchersUnavailable } from './customError.util';

class Vouchers {
  validateRequestParams = (
    productInfo: IProductWithVouchers,
    updateVoucherParams: UpdateVouchersParams,
  ) => {
    const { vouchersAvailable } = productInfo;
    const { amount } = updateVoucherParams;

    const totalVouchersAvailable = vouchersAvailable.length;
    const areVouchersBelowMinimumQty = totalVouchersAvailable < Number(MINIMUM_VOUCHER_QUANTITY);
    if (areVouchersBelowMinimumQty) throw new CustomError(vouchersUnavailable);

    const areVouchersBelowRequestedQty = (Number(MINIMUM_VOUCHER_QUANTITY) 
      > totalVouchersAvailable - amount);
    if (areVouchersBelowRequestedQty) throw new CustomError(vouchersNotEnough);
  };
}

export default new Vouchers();
