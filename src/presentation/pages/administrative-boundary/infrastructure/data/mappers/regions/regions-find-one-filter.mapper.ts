import { RegionsFindOneFilterValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-find-one-filter.validate-contract';
import { RegionsFindOneFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-find-one-filter-api.dto';

export function regionsFindOneFilterMapper(
    filter: RegionsFindOneFilterValidateContract
): RegionsFindOneFilterApiDto {
    const params: RegionsFindOneFilterApiDto = {} as RegionsFindOneFilterApiDto;

    if (filter.uniqId) {
        params.code = filter.uniqId;
    }

    return params;
}
