import { SiteGroupDisableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-disable-api.dto';
import { SiteGroupDisableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.validate-contract';

export function siteGroupDisableMapper(
    validContract: SiteGroupDisableValidateContract
): SiteGroupDisableApiDto {
    const params = {} as SiteGroupDisableApiDto;
    if (validContract.uniqId) {
        params.uniq_id = validContract.uniqId;
    }
    return params;
}
