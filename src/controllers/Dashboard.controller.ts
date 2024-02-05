import { Request, Response } from 'express';
import { IProductCreateInfoBody, IProductCreateInfoSchema } from '../interfaces/IProducts';
import { ProductsService, TagsService, VouchersService } from '../services';
import Dashboard from '../utils/dashboard.util';
import { IVoucherNewParamsRaw, IVouchersCodeArraySchema } from '../interfaces/IVouchers';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { ITagsNewInBody, ITagsNewSchema } from '../interfaces/ITags';

export default class DashboardController {
  public static async createProduct(req: Request, res: Response): Promise<void> {
    const { newProductInfo } = <IProductCreateInfoBody>req.body;
    IProductCreateInfoSchema.parse(newProductInfo);

    const productId = await ProductsService.createProduct(newProductInfo);

    res.status(200).json(productId);
  }

  public static async createVoucher(req: Request, res: Response): Promise<void> {
    const vouchers = Dashboard.getVoucherCodesFromReq(req);
    const vouchersParams = <IVoucherNewParamsRaw>req.query;

    const vouchersParamsFormatted = formatRequestQueryUtil.formartNewVouchersParams(vouchersParams);
    const voucherCodeArray = Dashboard.addInfoToVoucherCodesArray({
      ...vouchersParamsFormatted,
      vouchers,
    });
    IVouchersCodeArraySchema.parse(voucherCodeArray);

    await VouchersService.createVouchers(voucherCodeArray);
             
    res.status(200).end();
  }

  public static async createTag(req: Request, res: Response): Promise<void> {
    const { tags, typeId } = <ITagsNewInBody>req.body;
    ITagsNewSchema.parse(tags);

    const formattedTags = Dashboard.formatTagsArrayWithName(tags);
    await TagsService.createTags(formattedTags, typeId);

    res.status(200).end();
  }
}
