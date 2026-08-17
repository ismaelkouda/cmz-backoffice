import { SiteGroupFindOneQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-find-one.query';
import { SiteGroupFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.contract';

export function siteGroupFindOneQueryMapper(
    query: SiteGroupFindOneQuery
): SiteGroupFindOneFilterContract {
    return {
        uniqId: query.uniqId,
    };
}
