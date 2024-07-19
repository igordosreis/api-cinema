/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Request, Response } from 'express';
import * as fs from 'node:fs';
import {
  IProductCreateInfoBody,
  IProductCreateInfoSchema,
  IProductEditInfoBody,
  IProductEditInfoSchema,
  IProductQueryDashboard,
  IProductQueryDashboardSchema,
  IProductTypeCreate,
  IProductTypeCreateInBody,
} from '../interfaces/IProducts';
import {
  CommentService,
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
import { ICommentLogsSearchQuerySchema } from '../interfaces/IComments';
import CustomError, { typeIconNotFound } from '../utils/customError.util';
import { IPaginationRequest } from '../interfaces/IPagination';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';

export default class DashboardController {
  // Shop
  public static async productsAndPacksGet(req: Request, res: Response) {
    const searchQuery = <IProductQueryDashboard>req.query;
    const formattedSearchQuery = IProductQueryDashboardSchema.parse(searchQuery);

    const { type } = formattedSearchQuery;
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

    if (typeof type === 'number') {
      const parsedSearchQuery = {
        ...formattedSearchQuery,
        type,
        limit: formattedSearchQuery.limit || 20,
        page: formattedSearchQuery.page || 0,
      };
      const product = await ProductsService.getProductsByQueryDashboard(parsedSearchQuery);

      return res.status(200).json(product);
    }

    if (typeof type === 'undefined') {
      const parsedSearchQuery = {
        ...formattedSearchQuery,
        limit: formattedSearchQuery.limit || 20,
        page: formattedSearchQuery.page || 0,
      };
      const { type: removedType, ...restOfQuery } = parsedSearchQuery;

      const product = await ProductsService.getProductsByQueryDashboard(restOfQuery);
      // const packs = await PacksService.getPacksByQueryDashboard(restOfQuery);
      // const allItems = [...product, ...packs];

      return res.status(200).json(product);
    }
  }

  // -- Products
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

  public static async getProductById(req: Request, res: Response): Promise<void> {
    const { id: productId } = req.params;

    const product = await ProductsService.getProductByIdDashboard(Number(productId));

    res.status(200).json(product);
  }

  public static async deleteProductType(req: Request, res: Response): Promise<void> {
    const { id: typeId } = req.params;

    await ProductsService.deleteProductTypeDashboard(Number(typeId));

    res.status(200).end();
  }

  public static async createProductType(req: Request, res: Response): Promise<void> {
    const { name } = <IProductTypeCreate>req.query;
    const { name: fileName } = <IProductTypeCreateInBody>req.body;
    
    const isFileNotFound = !req.file;
    if (isFileNotFound) throw new CustomError(typeIconNotFound);

    await ProductsService.createProductType({ name, fileName });

    res.status(200).end();
  }

  public static async getAllProductTypes(_req: Request, res: Response): Promise<void> {
    const allProductsTypes = await ProductsService.getProductsTypes();

    res.status(200).json({
      count: allProductsTypes.length,
      data: allProductsTypes,
    });
  }

  public static async getProductsStatusCount(req: Request, res: Response): Promise<void> {
    const { establishmentId } = req.query;

    const count = await ProductsService.getProductsStatusCountDashboard(Number(establishmentId));

    res.status(200).json(count);
  }

  // -- Packs
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

  public static async getPackById(req: Request, res: Response): Promise<void> {
    const { id: packId } = req.params;

    const pack = await PacksService.getPackByIdDashboard(Number(packId));

    res.status(200).json(pack);
  }

  // Voucher
  public static async createVoucher(req: Request, res: Response): Promise<void> {
    const voucherCodes = VoucherUtil.getVoucherCodesFromReq(req);
    const vouchersParams = <IVoucherNewParamsRaw>req.query;

    const vouchersParamsFormatted = IVoucherNewParamsSchema.parse(vouchersParams);
    const voucherInfoArray = VoucherUtil.addInfoToVoucherCodesArray({
      ...vouchersParamsFormatted,
      voucherCodes,
    });
    IVouchersInfoArraySchema.parse(voucherInfoArray);

    const errorPath = await VouchersService.createVouchersDashboard(voucherInfoArray);
    const isError = errorPath;
    if (isError) {
      res
        .status(400)
        .download(errorPath, 'codigos_com_erro.xlsx', () => { fs.unlinkSync(errorPath); });
      
      return;
    }
    res.status(200).end();
  }

  public static async getVouchers(req: Request, res: Response): Promise<void> {
    const vouchersInfo = <IVouchersGetDashboard>req.query;
    const parsedVouchersInfo = IVouchersGetDashboardSchema.parse(vouchersInfo);
    const { page, limit } = parsedVouchersInfo;

    const pagination = formatRequestQueryUtil.formatPagination({ page, limit });

    const vouchers = await VouchersService.getVouchersDashboard({
      ...parsedVouchersInfo,
      ...pagination,
    });

    res.status(200).json(vouchers);
  }

  public static async getVouchersStatusCount(req: Request, res: Response): Promise<void> {
    const { productId } = req.query;

    const count = await VouchersService.getVouchersStatusCountDashboard(Number(productId));

    res.status(200).json(count);
  }

  public static async withdrawSingleVoucher(req: Request, res: Response): Promise<void> {
    const voucherInfo = req.query as unknown as IVoucherSingleWithdraw;

    const parsedVoucherInfo = IVoucherSingleWithdrawSchema.parse(voucherInfo);
    await VouchersService.withdrawSingleVoucherDashboard(parsedVoucherInfo);

    res.status(200).end();
  }

  public static async getVoucherTypes(req: Request, res: Response): Promise<void> {
    const types = await VouchersService.getVoucherTypes();

    res.status(200).json({
      count: types.length,
      data: types,
    });
  }

  public static async getExampleExcel(_req: Request, res: Response): Promise<void> {
    res.download(
      'uploads/dashboard/excel/exemplo.xlsx',
      'exemplo.xlsx',
    );
  }

  // Tag
  public static async createTag(req: Request, res: Response): Promise<void> {
    const { tags, typeId } = <ITagsNewInBody>req.body;
    ITagsNewSchema.parse(tags);

    const formattedTags = TagsUtil.formatTagsArrayWithName(tags);
    await TagsService.createTagsDashboard(formattedTags, typeId);

    res.status(200).end();
  }

  // Establishmet
  public static async getEstablishmentBrandById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const brand = await EstablishmentsService.getEstablishmentByIdDashboard(Number(id));

    res.status(200).json(brand);
  }

  public static async getEstablishmentBrands(req: Request, res: Response): Promise<void> {
    const paginationRequest = <IPaginationRequest>req.query;
    const pagination = formatRequestQueryUtil.formatPagination(paginationRequest);
    
    const brands = await EstablishmentsService.getAllEstablishmentsDashboard(pagination);

    res.status(200).json(brands);
  }

  public static async getEstablishmentAddress(req: Request, res: Response): Promise<void> {
    const addressInfo = <IEstablishmentAddressGet>req.query;
    const parsedAddressInfo = IEstablishmentAddressGetSchema.parse(addressInfo);
    const { page, limit } = parsedAddressInfo;

    const pagination = formatRequestQueryUtil.formatPagination({ page, limit });

    const addresses = await EstablishmentsService.getEstablishmentAddressDashboard({
      ...parsedAddressInfo,
      ...pagination,
    });

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

  public static async getEstablishmentActiveStatusCountDashboard(
    _req: Request,
    res: Response,
  ): Promise<void> {
    const count = await EstablishmentsService.getEstablishmentActiveStatusCountDashboard();

    res.status(200).json(count);
  }

  // Comment
  public static async getAllCommentActions(_req: Request, res: Response): Promise<void> {
    const allActions = await CommentService.getAllCommentActions();

    res.status(200).json(allActions);
  }

  public static async getCommentLogsByQuery(req: Request, res: Response): Promise<void> {
    const commentLogsSearchQuery = req.query;

    const parsedCommentLogsSearchQuery = ICommentLogsSearchQuerySchema
      .parse(commentLogsSearchQuery);
    const allCommentLogs = await CommentService.getCommentLogsByQuery(parsedCommentLogsSearchQuery);

    res.status(200).json(allCommentLogs);
  }
}
