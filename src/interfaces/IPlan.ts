import PlansModel from '../database/models/Plans.model';
import PlansProductsTypes from '../database/models/PlansProductsTypes';
import ProductsTypesModel from '../database/models/ProductsTypes.model';

export type IPlanInfo = PlansModel & {
  planDetails: Array<PlansProductsTypes & {
    type: ProductsTypesModel;
  }>;
};

export interface IPlanUsedAmount {
  userId: string;
  cinemaPlan: number;
}

export type IPlanTypeUsedInfo = {
  appName: string;
  typeId: number;
  typeName: string;
  typeIcon: string;
  planMaxAmount: number;
  usedAmount: number;
};
