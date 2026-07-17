import { RegionsFindOneFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-find-one-filter.dto';
import { RegionsFindOneFilterValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-find-one-filter.validate-contract';
import { validateRegionsFindOneFilter } from '@presentation/pages/administrative-boundary/domain/validators/regions/regions-find-one-filter.validator';

export function regionsFindOneFilterVo(
    dto: RegionsFindOneFilterDto
): RegionsFindOneFilterValidateContract {
    validateRegionsFindOneFilter(dto);
    return {
        uniqId: dto.uniqId,
    };
}
