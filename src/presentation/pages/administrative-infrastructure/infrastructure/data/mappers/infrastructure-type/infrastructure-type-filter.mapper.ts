import { InfrastructureTypeFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-filter-api.dto';
import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';

export function infrastructureTypeFilterMapper(
    validContract: InfrastructureTypeFilterContract
): InfrastructureTypeFilterApiDto {
    const params: InfrastructureTypeFilterApiDto =
        {} as InfrastructureTypeFilterApiDto;

    if (validContract.search) {
        params.search = validContract.search;
    }
    if (validContract.status !== undefined) {
        params.is_active = !!validContract.status;
    }

    return params;
}
