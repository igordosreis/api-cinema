import { Request, Response } from 'express';
import {
  IProductCreateInfoBody,
  IProductCreateInfoSchema,
  IProductEditInfoBody,
  IProductEditInfoSchema,
} from '../interfaces/IProducts';
import { PacksService, ProductsService, TagsService, VouchersService } from '../services';
import DashboardUtil from '../utils/dashboard.util';
import {
  IVoucherNewParamsRaw,
  IVoucherSingleWithdraw,
  IVoucherSingleWithdrawSchema,
  IVouchersCodeArraySchema,
  IVouchersGetDashboard,
  IVouchersGetDashboardSchema,
} from '../interfaces/IVouchers';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { ITagsNewInBody, ITagsNewSchema } from '../interfaces/ITags';
import { IPackCreateInfoBody, IPackCreateInfoSchema } from '../interfaces/IPacks';

export default class DashboardController {
  public static async createProduct(req: Request, res: Response): Promise<void> {
    const { productInfo } = <IProductCreateInfoBody>req.body;
    const parsedNewProductInfo = IProductCreateInfoSchema.parse(productInfo);

    const productId = await ProductsService.createProduct(parsedNewProductInfo);

    res.status(200).json(productId);
  }

  public static async createPack(req: Request, res: Response): Promise<void> {
    const { packInfo } = <IPackCreateInfoBody>req.body;
    const parsedNewPackInfo = IPackCreateInfoSchema.parse(packInfo);

    const packId = await PacksService.createPack(parsedNewPackInfo);

    res.status(200).json(packId);
  }

  public static async createVoucher(req: Request, res: Response): Promise<void> {
    const vouchers = DashboardUtil.getVoucherCodesFromReq(req);
    const vouchersParams = <IVoucherNewParamsRaw>req.query;

    const vouchersParamsFormatted = formatRequestQueryUtil.formartNewVouchersParams(vouchersParams);
    const voucherCodeArray = DashboardUtil.addInfoToVoucherCodesArray({
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

    const formattedTags = DashboardUtil.formatTagsArrayWithName(tags);
    await TagsService.createTags(formattedTags, typeId);

    res.status(200).end();
  }

  public static async getVouchers(req: Request, res: Response): Promise<void> {
    const vouchersInfo = <IVouchersGetDashboard>req.query;
    const parsedVouchersInfo = IVouchersGetDashboardSchema.parse(vouchersInfo);

    const vouchers = await VouchersService.getVouchersDashboard(parsedVouchersInfo);

    res.status(200).json(vouchers);
  }

  public static async withdrawSingleVoucher(req: Request, res: Response): Promise<void> {
    const voucherInfo = req.query as unknown as IVoucherSingleWithdraw;
    
    const parsedVoucherInfo = IVoucherSingleWithdrawSchema.parse(voucherInfo);
    await VouchersService.withdrawSingleVoucher(parsedVoucherInfo);

    res.status(200).end();
  }

  public static async editProduct(req: Request, res: Response): Promise<void> {
    const { productInfo } = <IProductEditInfoBody>req.body;

    const parsedEditProductInfo = IProductEditInfoSchema.parse(productInfo);
    await ProductsService.editProduct(parsedEditProductInfo);

    res.status(200).end();
  }
}
