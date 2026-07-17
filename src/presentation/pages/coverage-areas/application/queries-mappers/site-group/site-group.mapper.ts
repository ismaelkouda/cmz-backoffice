import { SiteGroupQuery } from '@pages/coverage-areas/application/queries/site-group/site-group.query';
import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';

export function siteGroupQueryMapper(
    query: SiteGroupQuery
): SiteGroupFilterContract {
    return {
        search: query.search,
        status: query.status,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
