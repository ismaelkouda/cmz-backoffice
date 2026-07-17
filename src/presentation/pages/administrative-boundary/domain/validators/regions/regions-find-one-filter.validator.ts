import { RegionsFindOneFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-find-one-filter.dto';
import { RegionsFindOneFilterValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-find-one-filter.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateRegionsFindOneFilter(
    dto: RegionsFindOneFilterDto
): asserts dto is RegionsFindOneFilterValidateContract {
    if (!dto.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.FIND_ONE.UNIQ_ID_REQUIRE'
        );
    }
}
