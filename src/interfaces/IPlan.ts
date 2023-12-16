import PlansModel from '../database/models/Plans.model';
import PlansProductsTypes from '../database/models/PlansProductsTypes';
import ProductsTypesModel from '../database/models/ProductsTypes.model';

export type IPlanInfo = PlansModel & {
  planDetails: Array<PlansProductsTypes & {
    type: ProductsTypesModel;
  }>;
};
