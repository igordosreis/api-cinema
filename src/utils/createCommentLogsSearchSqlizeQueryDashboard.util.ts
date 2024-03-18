/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { ICommentLogsSearchQuery } from '../interfaces/IComments';

class CreateCommentLogsSearchSqlizeQueryDashboard {
  private addParams = ({
    userId,
    createdAt,
    action,
  }: ICommentLogsSearchQuery) => {
    const searchQuery = [];
    if (userId) searchQuery.push({ userId });
    if (createdAt) searchQuery.push({ createdAt: { [Op.substring]: createdAt } });
    if (action) {
      searchQuery.push({
        '$commentAction.name$': { [Op.substring]: action },
      });
    }

    return {
      where: {
        [Op.and]: searchQuery,
      },
    };
  };

  create = (formattedQuery: ICommentLogsSearchQuery) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { where: {} };
  };
}

export default new CreateCommentLogsSearchSqlizeQueryDashboard();
