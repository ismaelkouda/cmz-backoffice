import { SiteGroupFindOneFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-find-one-filter-api.dto';
import { SiteGroupFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.validate-contract';

export function siteGroupFindOneFilterMapper(
    validContract: SiteGroupFindOneFilterValidateContract
): SiteGroupFindOneFilterApiDto {
    const params: SiteGroupFindOneFilterApiDto =
        {} as SiteGroupFindOneFilterApiDto;

    if (validContract.uniqId) {
        params.id = validContract.uniqId;
    }

    return params;
}
