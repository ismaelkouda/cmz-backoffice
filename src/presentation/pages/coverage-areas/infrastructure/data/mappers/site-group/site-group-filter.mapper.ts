import { SiteGroupFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-filter-api.dto';
import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';
import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';

export function siteGroupFilterMapper(
    validContract: SiteGroupFilterContract
): SiteGroupFilterApiDto {
    const params: SiteGroupFilterApiDto = {} as SiteGroupFilterApiDto;

    if (validContract.search) {
        params.search = validContract.search;
    }
    if (validContract.status !== undefined) {
        params.is_active = validContract.status === Status.ACTIVE;
    }

    return params;
}
