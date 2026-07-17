import { SiteGroupDeleteApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-delete-api.dto';
import { SiteGroupDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.validate-contract';

export function siteGroupDeleteMapper(
    validContract: SiteGroupDeleteValidateContract
): SiteGroupDeleteApiDto {
    const params = {} as SiteGroupDeleteApiDto;
    if (validContract.uniqId) {
        params.uniq_id = validContract.uniqId;
    }
    return params;
}
