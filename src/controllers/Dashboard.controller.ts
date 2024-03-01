/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Request, Response } from 'express';
import {
  IProductCreateInfoBody,
  IProductCreateInfoSchema,
  IProductEditInfoBody,
  IProductEditInfoSchema,
  IProductQueryDashboard,
  IProductQueryDashboardSchema,
} from '../interfaces/IProducts';
import {
  EstablishmentsService,
  PacksService,
  ProductsService,
  TagsService,
  VouchersService,
} from '../services';
import VoucherUtil from '../utils/voucher.util';
import {
  IVoucherNewParamsRaw,
  IVoucherNewParamsSchema,
  IVoucherSingleWithdraw,
  IVoucherSingleWithdrawSchema,
  IVouchersInfoArraySchema,
  IVouchersGetDashboard,
  IVouchersGetDashboardSchema,
} from '../interfaces/IVouchers';
import { ITagsNewInBody, ITagsNewSchema } from '../interfaces/ITags';
import {
  IPackCreateInfoBody,
  IPackCreateInfoSchema,
  IPackEditInfoBody,
  IPackEditInfoSchema,
} from '../interfaces/IPacks';
import {
  IEstablishmentAddressGet,
  IEstablishmentAddressGetSchema,
  IEstablishmentBrandEditInBody,
  IEstablishmentBrandEditSchema,
  IEstablishmentImageEditSchema,
  IEstablishmentImageName,
  IEstablishmentImageRawEdit,
} from '../interfaces/IEstablishments';
import TagsUtil from '../utils/tags.util';

export default class DashboardController {
  public static async createProduct(req: Request, res: Response): Promise<void> {
    const { productInfo } = <IProductCreateInfoBody>req.body;
    const parsedNewProductInfo = IProductCreateInfoSchema.parse(productInfo);

    const productId = await ProductsService.createProductDashboard(parsedNewProductInfo);

    res.status(200).json(productId);
  }

  public static async editProduct(req: Request, res: Response): Promise<void> {
    const { productInfo } = <IProductEditInfoBody>req.body;

    const parsedEditProductInfo = IProductEditInfoSchema.parse(productInfo);
    await ProductsService.editProductDashboard(parsedEditProductInfo);

    res.status(200).end();
  }

  public static async createPack(req: Request, res: Response): Promise<void> {
    const { packInfo } = <IPackCreateInfoBody>req.body;
    const parsedNewPackInfo = IPackCreateInfoSchema.parse(packInfo);

    const packId = await PacksService.createPackDashboard(parsedNewPackInfo);

    res.status(200).json(packId);
  }

  public static async editPack(req: Request, res: Response): Promise<void> {
    const { packInfo } = <IPackEditInfoBody>req.body;
    const parsedEditPackInfo = IPackEditInfoSchema.parse(packInfo);

    const packId = await PacksService.editPackDashboard(parsedEditPackInfo);

    res.status(200).json(packId);
  }

  public static async createVoucher(req: Request, res: Response): Promise<void> {
    const voucherCodes = VoucherUtil.getVoucherCodesFromReq(req);
    const vouchersParams = <IVoucherNewParamsRaw>req.query;

    const vouchersParamsFormatted = IVoucherNewParamsSchema.parse(vouchersParams);
    const voucherInfoArray = VoucherUtil.addInfoToVoucherCodesArray({
      ...vouchersParamsFormatted,
      voucherCodes,
    });
    IVouchersInfoArraySchema.parse(voucherInfoArray);

    await VouchersService.createVouchersDashboard(voucherInfoArray);

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
    await VouchersService.withdrawSingleVoucherDashboard(parsedVoucherInfo);

    res.status(200).end();
  }

  public static async createTag(req: Request, res: Response): Promise<void> {
    const { tags, typeId } = <ITagsNewInBody>req.body;
    ITagsNewSchema.parse(tags);

    const formattedTags = TagsUtil.formatTagsArrayWithName(tags);
    await TagsService.createTagsDashboard(formattedTags, typeId);

    res.status(200).end();
  }

  public static async getEstablishmentBrands(_req: Request, res: Response): Promise<void> {
    const brands = await EstablishmentsService.getAllEstablishments();

    res.status(200).json(brands);
  }

  public static async getEstablishmentAddress(req: Request, res: Response): Promise<void> {
    const addressInfo = <IEstablishmentAddressGet>req.query;

    const parsedAddressInfo = IEstablishmentAddressGetSchema.parse(addressInfo);
    const addresses = await EstablishmentsService.getEstablishmentAddress(parsedAddressInfo);

    res.status(200).json(addresses);
  }

  public static async editEstablishmentBrand(req: Request, res: Response): Promise<void> {
    const { establishmentInfo } = <IEstablishmentBrandEditInBody>req.body;

    const parsedEditInfo = IEstablishmentBrandEditSchema.parse(establishmentInfo);
    await EstablishmentsService.editEstablishmentBrandDashboard(parsedEditInfo);

    res.status(200).end();
  }

  public static async editEstablishmentImage(req: Request, res: Response): Promise<void> {
    const imageInfo = <IEstablishmentImageRawEdit>req.query;
    const { name } = <IEstablishmentImageName>req.body;

    const parsedImageInfo = IEstablishmentImageEditSchema.parse(imageInfo);
    await EstablishmentsService.editImageDashboard(parsedImageInfo, name);

    res.status(200).end();
  }

  public static async productsAndPacksGet(req: Request, res: Response) {
    const searchQuery = <IProductQueryDashboard>req.query;
    const formattedSearchQuery = IProductQueryDashboardSchema.parse(searchQuery);

    const { type } = searchQuery;
    if (type === 'pack') {
      const parsedSearchQuery = {
        ...formattedSearchQuery,
        limit: formattedSearchQuery.limit || 20,
        page: formattedSearchQuery.page || 0,
      };

      const { type: removedType, ...restOfQuery } = parsedSearchQuery;
      const packs = await PacksService.getPacksByQueryDashboard(restOfQuery);

      return res.status(200).json(packs);
    }

    const parsedSearchQuery = {
      ...formattedSearchQuery,
      type,
      limit: formattedSearchQuery.limit || 20,
      page: formattedSearchQuery.page || 0,
    };
    const product = await ProductsService.getProductsByQueryDashboard(parsedSearchQuery);

    return res.status(200).json(product);
  }
}
