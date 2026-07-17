import { SiteGroupUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.validate-contract';
import { SiteGroupUpdateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-update-api.dto';

export function siteGroupUpdateMapper(
    validContract: SiteGroupUpdateValidateContract
): SiteGroupUpdateApiDto {
    const params: SiteGroupUpdateApiDto = {} as SiteGroupUpdateApiDto;

    if (validContract.uniqId) {
        params.id = validContract.uniqId;
    }
    if (validContract.code) {
        params.code = validContract.code;
    }
    if (validContract.name) {
        params.name = validContract.name;
    }
    if (validContract.description) {
        params.description = validContract.description;
    }

    return params;
}
