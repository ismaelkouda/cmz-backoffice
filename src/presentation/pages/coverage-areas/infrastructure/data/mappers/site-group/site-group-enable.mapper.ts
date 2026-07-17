import { SiteGroupEnableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-enable-api.dto';
import { SiteGroupEnableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.validate-contract';

export function siteGroupEnableMapper(
    validContract: SiteGroupEnableValidateContract
): SiteGroupEnableApiDto {
    const params = {} as SiteGroupEnableApiDto;
    if (validContract.uniqId) {
        params.uniq_id = validContract.uniqId;
    }
    return params;
}
