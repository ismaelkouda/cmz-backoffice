import { SiteGroupCreateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.validate-contract';
import { SiteGroupCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-create-api.dto';

export function siteGroupCreateMapper(
    validContract: SiteGroupCreateValidateContract
): SiteGroupCreateApiDto {
    const params: SiteGroupCreateApiDto = {} as SiteGroupCreateApiDto;

    if (validContract.code) {
        params.code = validContract.code;
    }
    if (validContract.name) {
        params.name = validContract.name;
    }
    if (validContract.description) {
        params.description = validContract.description;
    }
    if (validContract.color) {
        params.color = validContract.color;
    }

    return params;
}
